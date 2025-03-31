import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoanApplicationForm, PredictionResult } from '@shared/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the Python script exists
const pythonScriptPath = path.join(__dirname, 'python', 'model.py');

// Function to predict loan approval using Python ML model
export async function predictLoanApproval(data: LoanApplicationForm): Promise<PredictionResult> {
  try {
    // Ensure the Python script directory exists
    const pythonDir = path.dirname(pythonScriptPath);
    if (!fs.existsSync(pythonDir)) {
      fs.mkdirSync(pythonDir, { recursive: true });
    }
    
    // Check if the Python script exists, if not create it
    if (!fs.existsSync(pythonScriptPath)) {
      console.log("Creating Python model script...");
      await createPythonModelScript();
    }
    
    // Prepare the input data for the Python script
    const inputData = JSON.stringify({
      Gender: data.gender,
      Married: data.married,
      Dependents: data.dependents,
      Education: data.education,
      Self_Employed: data.selfEmployed,
      ApplicantIncome: data.applicantIncome,
      CoapplicantIncome: data.coapplicantIncome,
      LoanAmount: data.loanAmount,
      Loan_Amount_Term: data.loanTerm,
      Credit_History: data.creditHistory,
      Property_Area: data.propertyArea,
    });
    
    // Run the Python script with the input data
    const result = await runPythonScript(inputData);
    
    // Parse the result
    const predictionResult: PredictionResult = JSON.parse(result);
    
    return predictionResult;
  } catch (error) {
    console.error('Error predicting loan approval:', error);
    throw new Error('Failed to predict loan approval');
  }
}

// Function to run Python script
async function runPythonScript(inputData: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [pythonScriptPath, inputData]);
    
    let resultData = '';
    let errorData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        console.error(`Error: ${errorData}`);
        reject(new Error(`Python process failed: ${errorData}`));
      } else {
        resolve(resultData.trim());
      }
    });
  });
}

// Function to create the Python model script
async function createPythonModelScript(): Promise<void> {
  const pythonCode = `
import sys
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# Function to predict loan approval
def predict_loan_approval(input_data):
    # Convert input data to pandas DataFrame
    input_df = pd.DataFrame([input_data])
    
    # Preprocess the input data
    input_df = preprocess_data(input_df)
    
    # Create a simple model (In a real-world scenario, this would be loaded from a pre-trained model)
    model = create_model()
    
    # Make prediction
    prediction_result = predict(model, input_df)
    
    # Return the prediction result
    return prediction_result

# Function to preprocess the data
def preprocess_data(df):
    # Handle categorical features
    categorical_cols = ['Gender', 'Married', 'Dependents', 'Education', 'Self_Employed', 'Property_Area']
    for col in categorical_cols:
        df[col] = df[col].astype(str)
    
    # Fill missing values
    df['Gender'] = df['Gender'].fillna('Male')  # Most common value
    df['Married'] = df['Married'].fillna('Yes')  # Most common value
    df['Dependents'] = df['Dependents'].fillna('0')  # Most common value
    df['Education'] = df['Education'].fillna('Graduate')  # Most common value
    df['Self_Employed'] = df['Self_Employed'].fillna('No')  # Most common value
    df['Credit_History'] = df['Credit_History'].astype(float).fillna(1.0)  # Most common value
    df['Loan_Amount_Term'] = df['Loan_Amount_Term'].fillna(360.0)  # Most common value
    
    # Replace '3+' with '3' for Dependents
    df['Dependents'] = df['Dependents'].replace('3+', '3')
    
    # Calculate Total Income
    df['Total_Income'] = df['ApplicantIncome'] + df['CoapplicantIncome']
    
    # Calculate Income to Debt Ratio
    df['Income_to_Debt_Ratio'] = df['Total_Income'] / df['LoanAmount']
    
    # Encode categorical variables
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
    
    return df

# Function to create a simple predictive model
def create_model():
    # In a real-world scenario, this would load a pre-trained model
    # For this demo, we'll create a simple model with pre-defined rules
    model = {
        'weights': {
            'Credit_History': 0.5,
            'Income_to_Debt_Ratio': 0.3,
            'Property_Area': 0.1,
            'Education': 0.05,
            'Self_Employed': 0.05
        }
    }
    return model

# Function to make prediction
def predict(model, df):
    # Calculate a simple score based on weighted features
    score = 0
    weights = model['weights']
    
    # Credit History (most important factor)
    credit_history = float(df['Credit_History'].iloc[0])
    score += weights['Credit_History'] * (credit_history if credit_history == 1.0 else 0)
    
    # Income to Debt Ratio
    income_debt_ratio = df['Income_to_Debt_Ratio'].iloc[0]
    ratio_score = min(1.0, income_debt_ratio / 5.0)  # Cap at 1.0, assuming ratio >= 5 is excellent
    score += weights['Income_to_Debt_Ratio'] * ratio_score
    
    # Property Area (Urban=2, Semiurban=1, Rural=0)
    property_area = int(df['Property_Area'].iloc[0])
    property_score = property_area / 2.0  # Normalize to [0, 1]
    score += weights['Property_Area'] * property_score
    
    # Education (Graduate=1, Not Graduate=0)
    education = int(df['Education'].iloc[0])
    score += weights['Education'] * education
    
    # Self Employed (Yes=1, No=0, with slight negative impact if self-employed)
    self_employed = int(df['Self_Employed'].iloc[0])
    score += weights['Self_Employed'] * (0.8 if self_employed == 1 else 1.0)
    
    # Determine approval and confidence
    approval_threshold = 0.6
    result = 'Y' if score >= approval_threshold else 'N'
    confidence = int(min(score * 100, 100)) if result == 'Y' else int(min((1 - score) * 100, 100))
    
    # Determine key factors
    key_factors = []
    impact_mapping = {
        True: 'Strong Positive' if credit_history == 1.0 else 'Strong Negative',
        False: 'Positive' if ratio_score >= 0.7 else 'Negative' if ratio_score < 0.5 else 'Neutral',
        'property': 'Positive' if property_score >= 0.5 else 'Negative' if property_score == 0 else 'Neutral',
        'education': 'Positive' if education == 1 else 'Negative',
        'self_employed': 'Neutral'
    }
    
    key_factors.append({
        "name": "Credit History",
        "impact": impact_mapping[True]
    })
    key_factors.append({
        "name": "Income to Loan Ratio",
        "impact": impact_mapping[False]
    })
    key_factors.append({
        "name": "Property Area",
        "impact": impact_mapping['property']
    })
    
    # Generate recommendations
    recommendations = []
    if result == 'Y':
        if credit_history == 1.0:
            recommendations.append("Your strong credit history significantly improved your chances.")
        if ratio_score >= 0.7:
            recommendations.append("Adequate income relative to requested loan amount.")
        else:
            recommendations.append("Consider increasing your income or reducing loan amount in the future.")
    else:
        if credit_history != 1.0:
            recommendations.append("Consider improving your credit history before reapplying.")
        if ratio_score < 0.5:
            recommendations.append("The income to loan ratio seems insufficient. Consider a smaller loan amount or increasing your income.")
        if property_score == 0:
            recommendations.append("Rural property areas may have lower approval rates. Consider property in urban or semi-urban areas.")
    
    return {
        "result": result,
        "confidence": confidence,
        "keyFactors": key_factors,
        "recommendations": recommendations
    }

if __name__ == "__main__":
    # Get input data from command line argument
    input_json = sys.argv[1]
    input_data = json.loads(input_json)
    
    # Make prediction
    result = predict_loan_approval(input_data)
    
    # Print the result as JSON
    print(json.dumps(result))
`;

  fs.writeFileSync(pythonScriptPath, pythonCode);
}
