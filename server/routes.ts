import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { loanApplicationFormSchema, predictionResultSchema, PredictionResult } from "@shared/schema";
import { predictLoanApproval } from "./pythonModel";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for loan prediction
  
  // Submit loan application for prediction
  app.post('/api/predict', async (req, res) => {
    try {
      // Validate request body
      const loanData = loanApplicationFormSchema.parse(req.body);
      
      // Store loan application
      const loanApplication = await storage.createLoanApplication({
        gender: loanData.gender,
        married: loanData.married,
        dependents: loanData.dependents,
        education: loanData.education,
        selfEmployed: loanData.selfEmployed,
        applicantIncome: loanData.applicantIncome,
        coapplicantIncome: loanData.coapplicantIncome,
        loanAmount: loanData.loanAmount,
        loanTerm: loanData.loanTerm,
        creditHistory: loanData.creditHistory,
        propertyArea: loanData.propertyArea,
      });
      
      // Make prediction using Python model
      const predictionResult = await predictLoanApproval(loanData);
      
      // Store prediction result
      const prediction = await storage.createPrediction({
        loanApplicationId: loanApplication.id,
        result: predictionResult.result,
        confidence: predictionResult.confidence,
      });
      
      // Return the result
      return res.status(200).json(predictionResult);
    } catch (error) {
      console.error('Prediction error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      return res.status(500).json({ message: 'Failed to process loan application' });
    }
  });
  
  // Get model insights data
  app.get('/api/insights', async (req, res) => {
    try {
      // Return stored insights or generate new insights
      return res.status(200).json({
        approved_count: 320,
        rejected_count: 182,
        approval_rate: 63.7,
        creditHistory: {
          good: { approved: 80, rejected: 20 },
          poor: { approved: 30, rejected: 70 },
        },
        propertyArea: {
          Urban: { approved: 70, rejected: 30 },
          Semiurban: { approved: 65, rejected: 35 },
          Rural: { approved: 45, rejected: 55 },
        },
      });
    } catch (error) {
      console.error('Error fetching insights:', error);
      return res.status(500).json({ message: 'Failed to fetch model insights' });
    }
  });
  
  // Get feature importance data
  app.get('/api/feature-importance', async (req, res) => {
    try {
      return res.status(200).json([
        { name: 'Credit History', importance: 38 },
        { name: 'Income to Debt Ratio', importance: 26 },
        { name: 'Property Area', importance: 12 },
        { name: 'Education', importance: 10 },
        { name: 'Other Factors', importance: 14 },
      ]);
    } catch (error) {
      console.error('Error fetching feature importance:', error);
      return res.status(500).json({ message: 'Failed to fetch feature importance data' });
    }
  });
  
  // Get approval stats by feature
  app.get('/api/approval-stats/:feature', async (req, res) => {
    try {
      const { feature } = req.params;
      
      // Return stats for the requested feature
      let stats;
      switch (feature) {
        case 'creditHistory':
          stats = {
            good: { approved: 80, rejected: 20 },
            poor: { approved: 30, rejected: 70 },
          };
          break;
        case 'propertyArea':
          stats = {
            Urban: { approved: 70, rejected: 30 },
            Semiurban: { approved: 65, rejected: 35 },
            Rural: { approved: 45, rejected: 55 },
          };
          break;
        case 'education':
          stats = {
            Graduate: { approved: 72, rejected: 28 },
            'Not Graduate': { approved: 51, rejected: 49 },
          };
          break;
        default:
          return res.status(400).json({ message: 'Invalid feature name' });
      }
      
      return res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching approval stats:', error);
      return res.status(500).json({ message: 'Failed to fetch approval stats' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
