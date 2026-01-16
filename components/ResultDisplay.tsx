import React from 'react';
import { VehicleResponse } from '../types';
import { CheckCircleIcon, AlertCircleIcon, CarIcon, DollarSignIcon, SearchIcon } from './Icons';

interface ResultDisplayProps {
  data: VehicleResponse;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, onReset }) => {
  if (!data.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-fade-in">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircleIcon className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
        <p className="text-red-600 mb-6">{data.error || "Could not retrieve vehicle data."}</p>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  const fines = data.multas || [];
  const hasFines = fines.length > 0;

  // Helper to parse strings like "Infração: EXCESSO DE VELOCIDADE" into key/value
  const parseRowItem = (item: string) => {
    const splitIndex = item.indexOf(':');
    if (splitIndex === -1) return { label: '', value: item };
    return {
      label: item.substring(0, splitIndex),
      value: item.substring(splitIndex + 1).trim()
    };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Vehicle Summary Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-primary-600">
            <CarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Vehicle Found</h2>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Placa: <span className="font-mono text-gray-900 font-medium">{data.placa}</span></span>
              <span>Renavam: <span className="font-mono text-gray-900 font-medium">{data.renavam}</span></span>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-xl border ${hasFines ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
          <div className="flex items-center gap-3">
             {hasFines ? (
               <AlertCircleIcon className="w-5 h-5 text-orange-600" />
             ) : (
               <CheckCircleIcon className="w-5 h-5 text-green-600" />
             )}
             <span className={`font-medium ${hasFines ? 'text-orange-800' : 'text-green-800'}`}>
               {hasFines 
                 ? `${fines.length} fine(s) found on record.` 
                 : "No fines found for this vehicle. Good job!"}
             </span>
          </div>
        </div>
      </div>

      {/* Fines List */}
      {hasFines && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 px-1">Detailed Fines</h3>
          {fines.map((row, rowIndex) => (
            <div key={rowIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
               {/* Mobile/Card Layout for each fine */}
               <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {row.map((item, colIndex) => {
                   const { label, value } = parseRowItem(item);
                   
                   // Styling tweaks based on content
                   let valueColor = "text-gray-900";
                   if (label.includes("Situação")) {
                     valueColor = value.toUpperCase().includes("PAGA") ? "text-green-600 font-bold" : "text-orange-600 font-bold";
                   }
                   if (label.includes("Valor")) {
                     valueColor = "text-gray-900 font-mono font-semibold";
                   }

                   return (
                     <div key={colIndex} className="flex flex-col">
                       <span className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">{label}</span>
                       <span className={`text-sm ${valueColor}`}>{value}</span>
                     </div>
                   );
                 })}
               </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center pt-4">
        <button
          onClick={onReset}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-2"
        >
          <SearchIcon className="w-4 h-4" />
          Consult another vehicle
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;