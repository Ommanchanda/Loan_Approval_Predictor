import { apiRequest } from './queryClient';
import { LoanApplicationForm, PredictionResult, PredictionResult as PredictionResultType } from '@shared/schema';

// Submit a loan application for prediction
export async function submitLoanApplication(data: LoanApplicationForm): Promise<PredictionResultType> {
  const response = await apiRequest('POST', '/api/predict', data);
  return response.json();
}

// Get model insights data
export async function getModelInsights() {
  const response = await apiRequest('GET', '/api/insights', undefined);
  return response.json();
}

// Get feature importance data
export async function getFeatureImportance() {
  const response = await apiRequest('GET', '/api/feature-importance', undefined);
  return response.json();
}

// Get approval stats by feature
export async function getApprovalStatsByFeature(feature: string) {
  const response = await apiRequest('GET', `/api/approval-stats/${feature}`, undefined);
  return response.json();
}

// Function to generate dummy prediction result for testing (will be replaced by real API)
export function generateDummyPredictionResult(approved: boolean): PredictionResult {
  return {
    result: approved ? 'Y' : 'N',
    confidence: approved ? 85 : 70,
    keyFactors: [
      {
        name: 'Credit History',
        impact: approved ? 'Strong Positive' : 'Strong Negative',
      },
      {
        name: 'Income to Loan Ratio',
        impact: approved ? 'Positive' : 'Negative',
      },
      {
        name: 'Employment Status',
        impact: 'Neutral',
      },
    ],
    recommendations: approved 
      ? [
          'Your strong credit history significantly improved your chances.',
          'Adequate income relative to requested loan amount.',
        ]
      : [
          'Consider improving your credit history before reapplying.',
          'The income to loan ratio seems insufficient. Consider a smaller loan amount or increasing your income.',
        ],
  };
}
