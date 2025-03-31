import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PredictionResult as PredictionResultType } from '@shared/schema';
import { Info, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PredictionResultProps {
  result: PredictionResultType;
  onReset: () => void;
}

export default function PredictionResult({ result, onReset }: PredictionResultProps) {
  const isApproved = result.result === 'Y';
  
  return (
    <Card>
      <CardHeader className="bg-[#00796b] bg-opacity-10 border-b border-[#e0e0e0]">
        <CardTitle className="text-lg font-medium text-[#00796b]">Prediction Results</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Prediction Result Card */}
        <div className={`text-center p-4 mb-4 rounded-lg ${isApproved ? 'bg-[#00796b] bg-opacity-10' : 'bg-red-500 bg-opacity-10'}`}>
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${isApproved ? 'bg-[#00796b] bg-opacity-20' : 'bg-red-500 bg-opacity-20'} mb-3`}>
            {isApproved ? (
              <CheckCircle className="h-10 w-10 text-[#00796b]" />
            ) : (
              <XCircle className="h-10 w-10 text-red-500" />
            )}
          </div>
          <h3 className={`text-xl font-semibold ${isApproved ? 'text-[#00796b]' : 'text-red-500'}`}>
            {isApproved ? 'Approved' : 'Not Approved'}
          </h3>
          <div className="mt-2 text-sm text-[#757575]">
            {isApproved 
              ? 'Your loan is likely to be approved.' 
              : 'Your loan application may not be approved.'
            }
          </div>
          <div className="mt-3">
            <Progress value={result.confidence} className={`${isApproved ? 'bg-[#e0e0e0]' : 'bg-red-100'}`} />
            <div className="mt-1 text-xs text-[#757575] text-right">{result.confidence}% Confidence</div>
          </div>
        </div>
        
        {/* Key Factors */}
        <h4 className="font-medium text-[#212121] mb-3">Key Factors</h4>
        <div className="space-y-3 mb-4">
          {result.keyFactors.map((factor, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="text-sm text-[#757575]">{factor.name}</div>
              <div className={`text-sm font-medium 
                ${factor.impact === 'Strong Positive' || factor.impact === 'Positive' 
                  ? 'text-[#00796b]'
                  : factor.impact === 'Neutral' 
                    ? 'text-[#757575]'
                    : 'text-red-500'
                }`}
              >
                {factor.impact}
              </div>
            </div>
          ))}
        </div>
        
        {/* Recommendations */}
        <h4 className="font-medium text-[#212121] mb-3">Recommendations</h4>
        <ul className="text-sm text-[#757575] space-y-2 mb-6">
          {result.recommendations.map((recommendation, index) => (
            <li key={index} className="flex">
              <Info className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
        
        {/* Actions */}
        <div className="mt-4 flex flex-col space-y-2">
          <Button className="w-full bg-[#00796b] hover:bg-[#004d40]">
            Download Report
          </Button>
          <Button 
            variant="outline" 
            className="w-full text-[#212121] border-[#e0e0e0]"
            onClick={onReset}
          >
            Try Another Scenario
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
