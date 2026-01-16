import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import ResultDisplay from './components/ResultDisplay';
import { consultVehicle } from './services/apiService';
import { RequestStatus, VehicleResponse } from './types';
import { CarIcon } from './components/Icons';

const App: React.FC = () => {
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.IDLE);
  const [data, setData] = useState<VehicleResponse | null>(null);

  const handleSearch = async (placa: string, renavam: string) => {
    setStatus(RequestStatus.LOADING);
    setData(null);

    // The backend uses Playwright which can be slow (10-20s), so UI feedback is critical
    const result = await consultVehicle({ placa, renavam });

    if (result.success) {
      setData(result);
      setStatus(RequestStatus.SUCCESS);
    } else {
      setData(result);
      setStatus(RequestStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(RequestStatus.IDLE);
    setData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-600">
            <CarIcon className="w-6 h-6" />
            <h1 className="font-bold text-xl tracking-tight text-gray-900">
              Multas<span className="text-primary-600">Check</span>
            </h1>
          </div>
          <div className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
            v1.0
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Vehicle Fines</h2>
          <p className="text-gray-500">
            Securely consult Detran records by License Plate and Renavam.
          </p>
        </div>

        {status === RequestStatus.IDLE && (
          <div className="animate-fade-in-up">
            <SearchForm 
              onSearch={handleSearch} 
              isLoading={false} 
            />
          </div>
        )}

        {status === RequestStatus.LOADING && (
          <div className="animate-pulse">
            <SearchForm 
              onSearch={() => {}} 
              isLoading={true} 
            />
            <div className="mt-8 text-center space-y-3">
              <div className="w-16 h-1 bg-primary-200 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-primary-600 w-1/2 animate-slide"></div>
              </div>
              <p className="text-sm text-gray-500">
                Connecting to Detran systems...<br/>
                This may take up to 20 seconds.
              </p>
            </div>
          </div>
        )}

        {(status === RequestStatus.SUCCESS || status === RequestStatus.ERROR) && data && (
          <ResultDisplay 
            data={data} 
            onReset={handleReset} 
          />
        )}
      </main>

      {/* Custom Styles for animations */}
      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-slide {
          animation: slide 1.5s infinite linear;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;