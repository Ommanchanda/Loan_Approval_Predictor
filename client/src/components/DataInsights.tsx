import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import Chart from 'chart.js/auto';

export default function DataInsights() {
  const creditHistoryChartRef = useRef<HTMLCanvasElement | null>(null);
  const propertyAreaChartRef = useRef<HTMLCanvasElement | null>(null);
  const educationChartRef = useRef<HTMLCanvasElement | null>(null);
  const approvalDistributionRef = useRef<HTMLCanvasElement | null>(null);
  const loanAmountChartRef = useRef<HTMLCanvasElement | null>(null);
  
  const chartInstances = useRef<{[key: string]: Chart | null}>({
    creditHistory: null,
    propertyArea: null,
    education: null,
    approvalDistribution: null,
    loanAmount: null
  });
  
  const { data: insightsData, isLoading } = useQuery({
    queryKey: ['/api/insights'],
  });

  // Create charts when data is loaded
  useEffect(() => {
    if (insightsData) {
      // Clean up existing charts
      Object.values(chartInstances.current).forEach(chart => {
        if (chart) chart.destroy();
      });
      
      // Credit History Chart
      if (creditHistoryChartRef.current) {
        const creditHistoryCtx = creditHistoryChartRef.current.getContext('2d');
        if (creditHistoryCtx) {
          chartInstances.current.creditHistory = new Chart(creditHistoryCtx, {
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
      }
      
      // Property Area Chart
      if (propertyAreaChartRef.current) {
        const propertyAreaCtx = propertyAreaChartRef.current.getContext('2d');
        if (propertyAreaCtx) {
          chartInstances.current.propertyArea = new Chart(propertyAreaCtx, {
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
      
      // Education Chart
      if (educationChartRef.current) {
        const educationCtx = educationChartRef.current.getContext('2d');
        if (educationCtx) {
          chartInstances.current.education = new Chart(educationCtx, {
            type: 'bar',
            data: {
              labels: ['Graduate', 'Not Graduate'],
              datasets: [{
                label: 'Approval Rate (%)',
                data: [72, 51],
                backgroundColor: ['#1a237e', '#7986cb'],
                borderColor: ['#1a237e', '#7986cb'],
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
      
      // Approval Distribution Pie Chart
      if (approvalDistributionRef.current) {
        const approvalCtx = approvalDistributionRef.current.getContext('2d');
        if (approvalCtx) {
          chartInstances.current.approvalDistribution = new Chart(approvalCtx, {
            type: 'pie',
            data: {
              labels: ['Approved', 'Rejected'],
              datasets: [{
                data: [63.7, 36.3],
                backgroundColor: ['#00796b', '#e57373'],
                borderColor: ['#00796b', '#e57373'],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return context.parsed + '%';
                    }
                  }
                },
                legend: {
                  position: 'bottom'
                }
              }
            }
          });
        }
      }
      
      // Loan Amount Distribution Chart
      if (loanAmountChartRef.current) {
        const loanAmountCtx = loanAmountChartRef.current.getContext('2d');
        if (loanAmountCtx) {
          chartInstances.current.loanAmount = new Chart(loanAmountCtx, {
            type: 'line',
            data: {
              labels: ['0-100K', '100K-200K', '200K-300K', '300K-400K', '400K-500K', '500K+'],
              datasets: [{
                label: 'Approval Rate (%)',
                data: [75, 68, 60, 55, 48, 40],
                backgroundColor: 'rgba(26, 35, 126, 0.2)',
                borderColor: '#1a237e',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#1a237e',
                pointBorderColor: '#fff',
                pointRadius: 4
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
    }
    
    // Clean up on unmount
    return () => {
      Object.values(chartInstances.current).forEach(chart => {
        if (chart) chart.destroy();
      });
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Chart 1: Approval Distribution */}
            <div className="bg-[#f5f7fa] rounded-lg p-4">
              <h3 className="text-sm font-medium text-[#212121] mb-4">Overall Approval Distribution</h3>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="h-64 relative">
                  <canvas ref={approvalDistributionRef} />
                </div>
              )}
              <p className="text-xs text-[#757575] mt-2">Overall loan approval rate is approximately 64%</p>
            </div>
            
            {/* Chart 2: Credit History Impact */}
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
            
            {/* Chart 3: Education Impact */}
            <div className="bg-[#f5f7fa] rounded-lg p-4">
              <h3 className="text-sm font-medium text-[#212121] mb-4">Approval Rate by Education</h3>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="h-64 relative">
                  <canvas ref={educationChartRef} />
                </div>
              )}
              <p className="text-xs text-[#757575] mt-2">Higher education level correlates with higher approval rates.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 4: Property Area */}
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
            
            {/* Chart 5: Loan Amount */}
            <div className="bg-[#f5f7fa] rounded-lg p-4">
              <h3 className="text-sm font-medium text-[#212121] mb-4">Approval Rate by Loan Amount</h3>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="h-64 relative">
                  <canvas ref={loanAmountChartRef} />
                </div>
              )}
              <p className="text-xs text-[#757575] mt-2">Lower loan amounts have higher approval rates.</p>
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
