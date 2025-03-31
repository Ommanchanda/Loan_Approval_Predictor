import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Format currency amount with Indian Rupee symbol
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Calculate income to debt ratio
export function calculateIncomeToDebtRatio(income: number, coappIncome: number, loanAmount: number): number {
  const totalIncome = income + coappIncome;
  if (loanAmount <= 0) return 0;
  return totalIncome / loanAmount;
}

// Check if credit history is good (1) or bad (0)
export function hasGoodCreditHistory(creditHistory: string): boolean {
  return creditHistory === '1';
}

// Get property area preference score (Urban > Semiurban > Rural)
export function getPropertyAreaScore(area: string): number {
  switch (area) {
    case 'Urban': return 3;
    case 'Semiurban': return 2;
    case 'Rural': return 1;
    default: return 0;
  }
}
