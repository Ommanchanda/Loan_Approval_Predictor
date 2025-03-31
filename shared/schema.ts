import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Loan application schema
export const loanApplications = pgTable("loan_applications", {
  id: serial("id").primaryKey(),
  gender: text("gender").notNull(),
  married: text("married").notNull(),
  dependents: text("dependents").notNull(),
  education: text("education").notNull(),
  selfEmployed: text("self_employed").notNull(),
  applicantIncome: real("applicant_income").notNull(),
  coapplicantIncome: real("coapplicant_income").notNull(),
  loanAmount: real("loan_amount").notNull(),
  loanTerm: integer("loan_term").notNull(),
  creditHistory: text("credit_history").notNull(),
  propertyArea: text("property_area").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLoanApplicationSchema = createInsertSchema(loanApplications).omit({
  id: true,
  createdAt: true,
});

// Prediction results schema
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  loanApplicationId: integer("loan_application_id").notNull(),
  result: text("result").notNull(), // 'Y' or 'N'
  confidence: real("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
});

// Create Zod schemas for validation
export const loanApplicationFormSchema = z.object({
  gender: z.enum(["Male", "Female"]),
  married: z.enum(["Yes", "No"]),
  dependents: z.enum(["0", "1", "2", "3+"]),
  education: z.enum(["Graduate", "Not Graduate"]),
  selfEmployed: z.enum(["Yes", "No"]),
  applicantIncome: z.number().positive(),
  coapplicantIncome: z.number().min(0),
  loanAmount: z.number().positive(),
  loanTerm: z.number().int().positive(),
  creditHistory: z.enum(["1", "0"]),
  propertyArea: z.enum(["Urban", "Semiurban", "Rural"]),
});

export const predictionResultSchema = z.object({
  result: z.enum(["Y", "N"]),
  confidence: z.number().min(0).max(100),
  keyFactors: z.array(
    z.object({
      name: z.string(),
      impact: z.enum(["Strong Positive", "Positive", "Neutral", "Negative", "Strong Negative"]),
    })
  ),
  recommendations: z.array(z.string()),
});

export type LoanApplicationForm = z.infer<typeof loanApplicationFormSchema>;
export type InsertLoanApplication = z.infer<typeof insertLoanApplicationSchema>;
export type LoanApplication = typeof loanApplications.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type PredictionResult = z.infer<typeof predictionResultSchema>;
