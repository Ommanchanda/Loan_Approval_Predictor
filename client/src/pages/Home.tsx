import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoanForm from '@/components/LoanForm';
import PredictionResult from '@/components/PredictionResult';
import DataInsights from '@/components/DataInsights';
import { PredictionResult as PredictionResultType } from '@shared/schema';
import { 
  ChartPie, 
  ArrowRight, 
  ChevronDown, 
  CreditCard, 
  DollarSign, 
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Home() {
  const [showResult, setShowResult] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResultType | null>(null);
  const [activeSection, setActiveSection] = useState<'form' | 'insights'>('form');
  const [showHero, setShowHero] = useState(true);
  
  // Scroll to form when clicking "Apply Now" button
  const scrollToForm = () => {
    const formSection = document.getElementById('application-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
      setShowHero(false);
    }
  };

  // Handle tab navigation between form and insights
  const handleSectionChange = (section: 'form' | 'insights') => {
    setActiveSection(section);
    if (section === 'insights') {
      const insightsSection = document.getElementById('data-insights');
      if (insightsSection) {
        insightsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const formSection = document.getElementById('application-form');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      {showHero && (
        <div className="bg-gradient-to-r from-primary/90 to-blue-600/90 text-white py-16 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3OTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGZpbGwtb3BhY2l0eT0iLjEiIGZpbGw9IiNGRkYiIGN4PSI3NTAiIGN5PSIzOTUiIHI9IjM4NSIvPjxjaXJjbGUgZmlsbC1vcGFjaXR5PSIuMSIgZmlsbD0iI0ZGRiIgY3g9IjI0MCIgY3k9IjE5MCIgcj0iMTcwIi8+PGNpcmNsZSBmaWxsLW9wYWNpdHk9Ii4xIiBmaWxsPSIjRkZGIiBjeD0iMTIyMCIgY3k9IjYwMCIgcj0iMjUwIi8+PC9nPjwvc3ZnPg==')] bg-no-repeat bg-cover opacity-20"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 inline-block text-transparent bg-clip-text">
                Predict Your Loan Approval Instantly
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-blue-100">
                Our advanced AI model analyzes your application data and provides accurate loan approval predictions in seconds.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={scrollToForm}
                  size="lg" 
                  className="bg-white text-primary hover:bg-blue-50"
                >
                  Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-transparent border-white text-white hover:bg-white/20"
                  onClick={() => handleSectionChange('insights')}
                >
                  <ChartPie className="mr-2 h-5 w-5" /> Explore Insights
                </Button>
              </div>
              
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI-Powered</h3>
                    <p className="text-sm text-blue-100">Advanced machine learning algorithms</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Fast Decisions</h3>
                    <p className="text-sm text-blue-100">Get predictions in seconds</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Smart Analysis</h3>
                    <p className="text-sm text-blue-100">Data-driven recommendations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#f8fafc" fillOpacity="1" d="M0,96L80,112C160,128,320,160,480,154.7C640,149,800,107,960,101.3C1120,96,1280,128,1360,144L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
          </div>
        </div>
      )}
      
      <main className="flex-grow container mx-auto py-6 px-4 sm:px-6 lg:px-8 mt-4">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm p-1 bg-gray-100">
            <button
              onClick={() => handleSectionChange('form')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                activeSection === 'form'
                  ? "bg-white shadow-sm text-primary"
                  : "text-gray-600 hover:text-primary hover:bg-white/60"
              )}
            >
              Loan Application
            </button>
            <button
              onClick={() => handleSectionChange('insights')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                activeSection === 'insights'
                  ? "bg-white shadow-sm text-primary"
                  : "text-gray-600 hover:text-primary hover:bg-white/60"
              )}
            >
              Data Insights
            </button>
          </div>
        </div>
        
        {/* Application Section */}
        <div id="application-form" className={cn(
          activeSection === 'form' ? 'block' : 'block'
        )}>
          {/* Page Header */}
          <div className="py-6 text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-primary to-blue-600 inline-block text-transparent bg-clip-text">
              Loan Application & Prediction
            </h1>
            <p className="mt-3 text-gray-600">
              Fill out the form below to predict your loan approval chances using our advanced AI model
            </p>
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
        </div>
        
        {/* Data Insights Section */}
        <div id="data-insights" className={cn(
          "transition-all duration-500",
          activeSection === 'insights' ? 'opacity-100' : 'opacity-100'
        )}>
          <DataInsights />
        </div>
      </main>
      
      {/* Trust Indicators Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12 text-gray-900">
            Trusted by Leading Financial Institutions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {/* Replace with actual bank logos or other trust indicators */}
            <div className="h-12 w-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 font-semibold">Bank A</div>
            <div className="h-12 w-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 font-semibold">Bank B</div>
            <div className="h-12 w-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 font-semibold">Bank C</div>
            <div className="h-12 w-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 font-semibold">Bank D</div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
