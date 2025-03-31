import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoanForm from '@/components/LoanForm';
import PredictionResult from '@/components/PredictionResult';
import DataInsights from '@/components/DataInsights';
import { useState } from 'react';
import { PredictionResult as PredictionResultType } from '@shared/schema';

export default function Home() {
  const [showResult, setShowResult] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResultType | null>(null);
  
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7fa]">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="py-6">
          <h1 className="text-2xl font-semibold text-[#212121]">Loan Application & Prediction</h1>
          <p className="mt-1 text-[#757575]">Fill out the form below to predict your loan approval chances</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Loan Application Form */}
          <div className="w-full lg:w-2/3">
            <LoanForm 
              onPredictionResult={(result) => {
                setPredictionResult(result);
                setShowResult(true);
              }}
            />
          </div>
          
          {/* Prediction Results */}
          {showResult && predictionResult && (
            <div className="w-full lg:w-1/3 h-min">
              <PredictionResult
                result={predictionResult}
                onReset={() => setShowResult(false)}
              />
            </div>
          )}
        </div>
        
        {/* Data Insights Section */}
        <DataInsights />
      </main>
      
      <Footer />
    </div>
  );
}
