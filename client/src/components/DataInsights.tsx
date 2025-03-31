import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import Chart from 'chart.js/auto';

export default function DataInsights() {
  const creditHistoryChartRef = useRef<HTMLCanvasElement | null>(null);
  const propertyAreaChartRef = useRef<HTMLCanvasElement | null>(null);
  const creditHistoryChartInstance = useRef<Chart | null>(null);
  const propertyAreaChartInstance = useRef<Chart | null>(null);
  
  const { data: insightsData, isLoading } = useQuery({
    queryKey: ['/api/insights'],
  });

  // Create charts when data is loaded
  useEffect(() => {
    if (insightsData && creditHistoryChartRef.current && propertyAreaChartRef.current) {
      // Clean up existing charts
      if (creditHistoryChartInstance.current) {
        creditHistoryChartInstance.current.destroy();
      }
      if (propertyAreaChartInstance.current) {
        propertyAreaChartInstance.current.destroy();
      }
      
      // Credit History Chart
      const creditHistoryCtx = creditHistoryChartRef.current.getContext('2d');
      if (creditHistoryCtx) {
        creditHistoryChartInstance.current = new Chart(creditHistoryCtx, {
          type: 'bar',
          data: {
            labels: ['Good Credit', 'Poor Credit'],
            datasets: [{
              label: 'Approval Rate (%)',
              data: [80, 30],
              backgroundColor: ['#1a237e', '#d32f2f'],
              borderColor: ['#1a237e', '#d32f2f'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.parsed.y + '%';
                  }
                }
              }
            }
          }
        });
      }
      
      // Property Area Chart
      const propertyAreaCtx = propertyAreaChartRef.current.getContext('2d');
      if (propertyAreaCtx) {
        propertyAreaChartInstance.current = new Chart(propertyAreaCtx, {
          type: 'bar',
          data: {
            labels: ['Urban', 'Semiurban', 'Rural'],
            datasets: [{
              label: 'Approval Rate (%)',
              data: [70, 65, 45],
              backgroundColor: '#1a237e',
              borderColor: '#1a237e',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.parsed.y + '%';
                  }
                }
              }
            }
          }
        });
      }
    }
    
    // Clean up on unmount
    return () => {
      if (creditHistoryChartInstance.current) {
        creditHistoryChartInstance.current.destroy();
      }
      if (propertyAreaChartInstance.current) {
        propertyAreaChartInstance.current.destroy();
      }
    };
  }, [insightsData]);
  
  const featureImportance = [
    { name: 'Credit History', importance: 38 },
    { name: 'Income to Debt Ratio', importance: 26 },
    { name: 'Property Area', importance: 12 },
    { name: 'Education', importance: 10 },
    { name: 'Other Factors', importance: 14 }
  ];
  
  return (
    <div className="mt-8">
      <Card>
        <CardHeader className="border-b border-[#e0e0e0]">
          <CardTitle className="text-lg font-medium text-[#212121]">Loan Approval Insights</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Approval by Credit History */}
            <div className="bg-[#f5f7fa] rounded-lg p-4">
              <h3 className="text-sm font-medium text-[#212121] mb-4">Approval Rate by Credit History</h3>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="h-64 relative">
                  <canvas ref={creditHistoryChartRef} />
                </div>
              )}
              <p className="text-xs text-[#757575] mt-2">Credit history is one of the strongest predictors of loan approval.</p>
            </div>
            
            {/* Chart 2: Approval by Property Area */}
            <div className="bg-[#f5f7fa] rounded-lg p-4">
              <h3 className="text-sm font-medium text-[#212121] mb-4">Approval Rate by Property Area</h3>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="h-64 relative">
                  <canvas ref={propertyAreaChartRef} />
                </div>
              )}
              <p className="text-xs text-[#757575] mt-2">Property location influences approval rates, with urban areas having higher approval.</p>
            </div>
          </div>
          
          {/* Feature Importance */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-[#212121] mb-4">Feature Importance in Prediction Model</h3>
            <div className="space-y-3">
              {featureImportance.map((feature, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-[#757575]">{feature.name}</span>
                    <span className="text-xs font-medium text-[#212121]">{feature.importance}%</span>
                  </div>
                  <div className="w-full bg-[#e0e0e0] rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${feature.importance}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
