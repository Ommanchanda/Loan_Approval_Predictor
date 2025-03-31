import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  PieChart, 
  BarChart, 
  LineChart as LineChartIcon, 
  Activity, 
  DollarSign, 
  Home,
  BriefcaseBusiness,
  UserCheck,
  FileStack,
  AreaChart
} from 'lucide-react';
import Chart from 'chart.js/auto';
import { cn } from '@/lib/utils';

export default function DataInsights() {
  const [expandedView, setExpandedView] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Chart references
  const creditHistoryChartRef = useRef<HTMLCanvasElement | null>(null);
  const propertyAreaChartRef = useRef<HTMLCanvasElement | null>(null);
  const approvalTrendChartRef = useRef<HTMLCanvasElement | null>(null);
  const incomeDistributionChartRef = useRef<HTMLCanvasElement | null>(null);
  const loanAmountChartRef = useRef<HTMLCanvasElement | null>(null);
  const featureImportanceChartRef = useRef<HTMLCanvasElement | null>(null);

  // Chart instances
  const chartInstances = useRef<{[key: string]: Chart | null}>({
    creditHistory: null,
    propertyArea: null,
    approvalTrend: null,
    incomeDistribution: null,
    loanAmount: null,
    featureImportance: null
  });
  
  const { data: insightsData, isLoading } = useQuery({
    queryKey: ['/api/insights'],
  });

  // Create charts when data is loaded
  useEffect(() => {
    // Only create charts for the active tab
    if (insightsData) {
      // Clean up existing charts
      Object.keys(chartInstances.current).forEach(key => {
        if (chartInstances.current[key]) {
          chartInstances.current[key]?.destroy();
          chartInstances.current[key] = null;
        }
      });

      // Create charts based on active tab
      if (activeTab === 'overview' || activeTab === 'credit') {
        createCreditHistoryChart();
      }
      
      if (activeTab === 'overview' || activeTab === 'property') {
        createPropertyAreaChart();
      }
      
      if (activeTab === 'trends') {
        createApprovalTrendChart();
      }
      
      if (activeTab === 'income') {
        createIncomeDistributionChart();
      }
      
      if (activeTab === 'loans') {
        createLoanAmountChart();
      }
      
      if (activeTab === 'features') {
        createFeatureImportanceChart();
      }
    }
    
    // Clean up on unmount
    return () => {
      Object.keys(chartInstances.current).forEach(key => {
        if (chartInstances.current[key]) {
          chartInstances.current[key]?.destroy();
          chartInstances.current[key] = null;
        }
      });
    };
  }, [insightsData, activeTab]);

  const createCreditHistoryChart = () => {
    if (creditHistoryChartRef.current) {
      const ctx = creditHistoryChartRef.current.getContext('2d');
      if (ctx) {
        chartInstances.current.creditHistory = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Good Credit', 'Poor Credit'],
            datasets: [{
              label: 'Approval Rate (%)',
              data: [80, 30],
              backgroundColor: [
                'rgba(25, 118, 210, 0.8)',
                'rgba(211, 47, 47, 0.8)'
              ],
              borderColor: [
                'rgb(25, 118, 210)',
                'rgb(211, 47, 47)'
              ],
              borderWidth: 1,
              borderRadius: 6
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
                },
                grid: {
                  display: true,
                  color: 'rgba(0, 0, 0, 0.05)'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                  label: function(context) {
                    return context.parsed.y + '% approval rate';
                  }
                }
              }
            },
            animation: {
              duration: 1500,
              easing: 'easeOutQuart'
            }
          }
        });
      }
    }
  };

  const createPropertyAreaChart = () => {
    if (propertyAreaChartRef.current) {
      const ctx = propertyAreaChartRef.current.getContext('2d');
      if (ctx) {
        chartInstances.current.propertyArea = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Urban', 'Semiurban', 'Rural'],
            datasets: [{
              label: 'Approval Rate (%)',
              data: [70, 65, 45],
              backgroundColor: [
                'rgba(103, 58, 183, 0.8)',
                'rgba(3, 169, 244, 0.8)',
                'rgba(139, 195, 74, 0.8)'
              ],
              borderColor: [
                'rgb(103, 58, 183)',
                'rgb(3, 169, 244)',
                'rgb(139, 195, 74)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                  label: function(context) {
                    return context.label + ': ' + context.parsed + '% approval rate';
                  }
                }
              }
            },
            animation: {
              animateRotate: true,
              animateScale: true,
              duration: 1500,
              easing: 'easeOutCirc'
            }
          }
        });
      }
    }
  };

  const createApprovalTrendChart = () => {
    if (approvalTrendChartRef.current) {
      const ctx = approvalTrendChartRef.current.getContext('2d');
      if (ctx) {
        chartInstances.current.approvalTrend = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
              {
                label: 'Approval Rate (%)',
                data: [65, 68, 62, 59, 73, 75, 79, 81, 76, 80, 83, 85],
                borderColor: 'rgb(25, 118, 210)',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                pointBackgroundColor: 'rgb(25, 118, 210)',
                pointBorderColor: '#fff',
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.3,
                fill: true
              },
              {
                label: 'Application Volume',
                data: [120, 138, 145, 110, 168, 172, 155, 160, 175, 190, 210, 220],
                borderColor: 'rgb(76, 175, 80)',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                pointBackgroundColor: 'rgb(76, 175, 80)',
                pointBorderColor: '#fff',
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.3,
                fill: true,
                yAxisID: 'y1'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                  display: true,
                  text: 'Approval Rate (%)',
                  color: 'rgb(25, 118, 210)',
                  font: {
                    weight: 'bold'
                  }
                },
                min: 50,
                max: 90,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                }
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                  display: true,
                  text: 'Application Volume',
                  color: 'rgb(76, 175, 80)',
                  font: {
                    weight: 'bold'
                  }
                },
                min: 100,
                max: 250,
                grid: {
                  display: false
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            },
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 8,
                usePointStyle: true
              }
            },
            animation: {
              duration: 2000,
              easing: 'easeOutQuad'
            }
          }
        });
      }
    }
  };

  const createIncomeDistributionChart = () => {
    if (incomeDistributionChartRef.current) {
      const ctx = incomeDistributionChartRef.current.getContext('2d');
      if (ctx) {
        chartInstances.current.incomeDistribution = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['<10k', '10k-25k', '25k-50k', '50k-75k', '75k-100k', '>100k'],
            datasets: [
              {
                label: 'Approved',
                data: [15, 30, 55, 75, 88, 92],
                backgroundColor: 'rgba(76, 175, 80, 0.7)',
                borderColor: 'rgb(76, 175, 80)',
                borderWidth: 1,
                borderRadius: 4
              },
              {
                label: 'Rejected',
                data: [85, 70, 45, 25, 12, 8],
                backgroundColor: 'rgba(244, 67, 54, 0.7)',
                borderColor: 'rgb(244, 67, 54)',
                borderWidth: 1,
                borderRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                stacked: true,
                grid: {
                  display: false
                },
                title: {
                  display: true,
                  text: 'Income Range (₹)',
                  font: {
                    weight: 'bold'
                  }
                }
              },
              y: {
                stacked: true,
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                },
                title: {
                  display: true,
                  text: 'Percentage',
                  font: {
                    weight: 'bold'
                  }
                }
              }
            },
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 8
              }
            },
            animation: {
              duration: 1500,
              easing: 'easeOutBounce'
            }
          }
        });
      }
    }
  };

  const createLoanAmountChart = () => {
    if (loanAmountChartRef.current) {
      const ctx = loanAmountChartRef.current.getContext('2d');
      if (ctx) {
        chartInstances.current.loanAmount = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: ['<100k', '100k-200k', '200k-300k', '300k-400k', '400k-500k', '>500k'],
            datasets: [
              {
                label: 'Approval Rate',
                data: [40, 65, 75, 60, 45, 30],
                backgroundColor: 'rgba(156, 39, 176, 0.2)',
                borderColor: 'rgb(156, 39, 176)',
                pointBackgroundColor: 'rgb(156, 39, 176)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(156, 39, 176)',
                pointRadius: 5,
                pointHoverRadius: 7
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                beginAtZero: true,
                min: 0,
                max: 100,
                ticks: {
                  display: false,
                  stepSize: 20
                },
                pointLabels: {
                  font: {
                    size: 12
                  }
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                },
                angleLines: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              }
            },
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                  label: function(context) {
                    return 'Approval rate: ' + context.raw + '%';
                  }
                }
              }
            },
            animation: {
              duration: 2000,
              easing: 'easeOutElastic'
            }
          }
        });
      }
    }
  };

  const createFeatureImportanceChart = () => {
    if (featureImportanceChartRef.current) {
      const ctx = featureImportanceChartRef.current.getContext('2d');
      if (ctx) {
        chartInstances.current.featureImportance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Credit History', 'Income to Debt Ratio', 'Property Area', 'Education', 'Other Factors'],
            datasets: [{
              data: [38, 26, 12, 10, 14],
              backgroundColor: [
                'rgba(33, 150, 243, 0.8)',
                'rgba(76, 175, 80, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(156, 39, 176, 0.8)',
                'rgba(96, 125, 139, 0.8)'
              ],
              borderColor: [
                'rgb(33, 150, 243)',
                'rgb(76, 175, 80)',
                'rgb(255, 193, 7)',
                'rgb(156, 39, 176)',
                'rgb(96, 125, 139)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                  label: function(context) {
                    return context.label + ': ' + context.parsed + '% importance';
                  }
                }
              }
            },
            animation: {
              animateRotate: true,
              animateScale: true,
              duration: 2000,
              easing: 'easeOutQuart'
            }
          }
        });
      }
    }
  };

  const featureImportance = [
    { name: 'Credit History', importance: 38, icon: <FileStack className="h-4 w-4 mr-2 text-blue-600" /> },
    { name: 'Income to Debt Ratio', importance: 26, icon: <DollarSign className="h-4 w-4 mr-2 text-green-600" /> },
    { name: 'Property Area', importance: 12, icon: <Home className="h-4 w-4 mr-2 text-yellow-600" /> },
    { name: 'Education', importance: 10, icon: <BriefcaseBusiness className="h-4 w-4 mr-2 text-purple-600" /> },
    { name: 'Other Factors', importance: 14, icon: <Activity className="h-4 w-4 mr-2 text-gray-600" /> }
  ];
  
  return (
    <div className="mt-8">
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/80 to-blue-600/80 text-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold">Loan Approval Insights</CardTitle>
              <CardDescription className="text-white/80 mt-1">
                Analyze the factors that influence loan approval decisions
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={() => setExpandedView(!expandedView)}
            >
              {expandedView ? (
                <><ChevronUp className="h-4 w-4 mr-1" /> Collapse</>
              ) : (
                <><ChevronDown className="h-4 w-4 mr-1" /> Expand</>
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className={cn("p-0 transition-all duration-500", 
          expandedView ? "max-h-[1500px]" : "max-h-[600px]"
        )}>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 border-b border-gray-200">
              <TabsList className="bg-transparent h-12 w-full justify-start gap-1 rounded-none border-b-0">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-background rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-12"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="credit" 
                  className="data-[state=active]:bg-background rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-12"
                >
                  <BarChart className="h-4 w-4 mr-1" /> Credit
                </TabsTrigger>
                <TabsTrigger 
                  value="property" 
                  className="data-[state=active]:bg-background rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-12"
                >
                  <PieChart className="h-4 w-4 mr-1" /> Property
                </TabsTrigger>
                <TabsTrigger 
                  value="trends" 
                  className="data-[state=active]:bg-background rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-12"
                >
                  <AreaChart className="h-4 w-4 mr-1" /> Trends
                </TabsTrigger>
                <TabsTrigger 
                  value="income" 
                  className="data-[state=active]:bg-background rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-12"
                >
                  <DollarSign className="h-4 w-4 mr-1" /> Income
                </TabsTrigger>
                <TabsTrigger 
                  value="loans" 
                  className="data-[state=active]:bg-background rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-12"
                >
                  <LineChartIcon className="h-4 w-4 mr-1" /> Loans
                </TabsTrigger>
                <TabsTrigger 
                  value="features" 
                  className="data-[state=active]:bg-background rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-12"
                >
                  <UserCheck className="h-4 w-4 mr-1" /> Features
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-6 m-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Approval by Credit History */}
                <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <h3 className="text-sm font-medium text-primary mb-4 flex items-center">
                    <BarChart className="h-4 w-4 mr-2" /> Approval Rate by Credit History
                  </h3>
                  {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <div className="h-64 relative">
                      <canvas ref={creditHistoryChartRef} />
                    </div>
                  )}
                  <p className="text-xs text-[#757575] mt-2 italic">Credit history is one of the strongest predictors of loan approval.</p>
                </div>
                
                {/* Chart 2: Approval by Property Area */}
                <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <h3 className="text-sm font-medium text-primary mb-4 flex items-center">
                    <PieChart className="h-4 w-4 mr-2" /> Approval Rate by Property Area
                  </h3>
                  {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <div className="h-64 relative">
                      <canvas ref={propertyAreaChartRef} />
                    </div>
                  )}
                  <p className="text-xs text-[#757575] mt-2 italic">Property location influences approval rates, with urban areas having higher approval.</p>
                </div>
              </div>
              
              {/* Feature Importance */}
              <div className="mt-6 bg-white rounded-lg p-4 shadow-md border border-gray-100">
                <h3 className="text-sm font-medium text-primary mb-4 flex items-center">
                  <UserCheck className="h-4 w-4 mr-2" /> Feature Importance in Prediction Model
                </h3>
                <div className="space-y-3">
                  {featureImportance.map((feature, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1 items-center">
                        <span className="text-xs text-[#212121] flex items-center font-medium">
                          {feature.icon} {feature.name}
                        </span>
                        <span className="text-xs font-semibold bg-primary/10 text-primary py-1 px-2 rounded-full">
                          {feature.importance}%
                        </span>
                      </div>
                      <div className="w-full bg-[#e0e0e0] rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="h-2.5 rounded-full relative overflow-hidden"
                          style={{ 
                            width: `${feature.importance}%`,
                            animation: `progressAnimation 1.5s ease-out`,
                            background: `linear-gradient(90deg, rgba(var(--primary-rgb), 0.8) 0%, rgba(var(--primary-rgb), 0.9) 100%)`
                          }}
                        >
                          <span className="absolute inset-0 bg-white/20 animate-pulse"></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="credit" className="p-6 m-0">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                <h3 className="text-lg font-medium text-[#212121] mb-4">Credit History Analysis</h3>
                <p className="text-sm text-[#757575] mb-6">
                  Credit history is the most significant factor in loan approval decisions, accounting for 38% of the prediction weight. 
                  Borrowers with good credit history (score of 1) have a significantly higher approval rate compared to those with poor credit history.
                </p>
                {isLoading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <div className="h-80 relative">
                    <canvas ref={creditHistoryChartRef} />
                  </div>
                )}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-700 flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-2" /> Good Credit History
                    </h4>
                    <p className="mt-2 text-blue-600">
                      80% approval rate with 2.7x higher chances of approval compared to poor credit history.
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <h4 className="font-medium text-red-700 flex items-center">
                      <XCircleIcon className="h-4 w-4 mr-2" /> Poor Credit History
                    </h4>
                    <p className="mt-2 text-red-600">
                      Only 30% approval rate with significant negative impact on prediction outcome.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="property" className="p-6 m-0">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                <h3 className="text-lg font-medium text-[#212121] mb-4">Property Area Impact</h3>
                <p className="text-sm text-[#757575] mb-6">
                  Property location accounts for 12% of prediction weight. Urban areas have the highest approval rates, 
                  followed by semi-urban areas, while rural properties show the lowest approval rates.
                </p>
                {isLoading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <div className="h-80 relative">
                    <canvas ref={propertyAreaChartRef} />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="p-6 m-0">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                <h3 className="text-lg font-medium text-[#212121] mb-4">Approval Trends Over Time</h3>
                <p className="text-sm text-[#757575] mb-6">
                  This chart shows how loan approval rates have changed over time, along with the volume of applications received.
                </p>
                {isLoading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <div className="h-80 relative">
                    <canvas ref={approvalTrendChartRef} />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="income" className="p-6 m-0">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                <h3 className="text-lg font-medium text-[#212121] mb-4">Income Distribution & Approval Rates</h3>
                <p className="text-sm text-[#757575] mb-6">
                  Income is a key factor in loan approval. Higher income brackets show significantly higher approval rates.
                </p>
                {isLoading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <div className="h-80 relative">
                    <canvas ref={incomeDistributionChartRef} />
                  </div>
                )}
                <p className="text-xs text-[#757575] mt-4 italic">
                  Income to debt ratio accounts for 26% of the prediction weight, making it the second most important factor.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="loans" className="p-6 m-0">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                <h3 className="text-lg font-medium text-[#212121] mb-4">Loan Amount Analysis</h3>
                <p className="text-sm text-[#757575] mb-6">
                  This radar chart shows approval rates by loan amount range. Medium-sized loans (200k-300k) have the highest approval rates.
                </p>
                {isLoading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <div className="h-80 relative">
                    <canvas ref={loanAmountChartRef} />
                  </div>
                )}
                <p className="text-xs text-[#757575] mt-4 italic">
                  Very large loans (over 500k) have lower approval rates due to higher risk assessment.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="features" className="p-6 m-0">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                <h3 className="text-lg font-medium text-[#212121] mb-4">Feature Importance Breakdown</h3>
                <p className="text-sm text-[#757575] mb-6">
                  See how different factors influence the loan prediction model's decision-making process.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {isLoading ? (
                      <Skeleton className="h-80 w-full" />
                    ) : (
                      <div className="h-80 relative">
                        <canvas ref={featureImportanceChartRef} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {featureImportance.map((feature, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-[#212121] flex items-center">
                            {feature.icon} {feature.name}
                          </span>
                          <span className="font-semibold bg-primary/10 text-primary py-1 px-3 rounded-full text-sm">
                            {feature.importance}%
                          </span>
                        </div>
                        <p className="text-xs text-[#757575]">
                          {feature.name === 'Credit History' && 'A clean credit history significantly improves approval chances.'}
                          {feature.name === 'Income to Debt Ratio' && 'Higher income relative to loan amount increases approval likelihood.'}
                          {feature.name === 'Property Area' && 'Urban properties have higher approval rates than rural ones.'}
                          {feature.name === 'Education' && 'Graduate education positively impacts loan approval.'}
                          {feature.name === 'Other Factors' && 'Includes marital status, dependents, and employment.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Components
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
