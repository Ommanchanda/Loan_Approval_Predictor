import {
  users, type User, type InsertUser,
  loanApplications, type LoanApplication, type InsertLoanApplication,
  predictions, type Prediction, type InsertPrediction,
} from "@shared/schema";

// Storage interface with additional methods for loan application
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Loan application methods
  createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication>;
  getLoanApplication(id: number): Promise<LoanApplication | undefined>;
  getLoanApplications(): Promise<LoanApplication[]>;
  
  // Prediction methods
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getPrediction(id: number): Promise<Prediction | undefined>;
  getPredictionsByLoanId(loanApplicationId: number): Promise<Prediction[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private loanApps: Map<number, LoanApplication>;
  private preds: Map<number, Prediction>;
  
  private userId: number;
  private loanAppId: number;
  private predId: number;

  constructor() {
    this.users = new Map();
    this.loanApps = new Map();
    this.preds = new Map();
    
    this.userId = 1;
    this.loanAppId = 1;
    this.predId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Loan application methods
  async createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication> {
    const id = this.loanAppId++;
    const now = new Date();
    const loanApp: LoanApplication = { 
      ...application, 
      id, 
      createdAt: now 
    };
    this.loanApps.set(id, loanApp);
    return loanApp;
  }
  
  async getLoanApplication(id: number): Promise<LoanApplication | undefined> {
    return this.loanApps.get(id);
  }
  
  async getLoanApplications(): Promise<LoanApplication[]> {
    return Array.from(this.loanApps.values());
  }
  
  // Prediction methods
  async createPrediction(prediction: InsertPrediction): Promise<Prediction> {
    const id = this.predId++;
    const now = new Date();
    const pred: Prediction = {
      ...prediction,
      id,
      createdAt: now,
    };
    this.preds.set(id, pred);
    return pred;
  }
  
  async getPrediction(id: number): Promise<Prediction | undefined> {
    return this.preds.get(id);
  }
  
  async getPredictionsByLoanId(loanApplicationId: number): Promise<Prediction[]> {
    return Array.from(this.preds.values()).filter(
      (pred) => pred.loanApplicationId === loanApplicationId
    );
  }
}

export const storage = new MemStorage();
