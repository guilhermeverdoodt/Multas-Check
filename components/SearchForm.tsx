import React, { useState } from 'react';
import { SearchIcon, LoaderIcon } from './Icons';

interface SearchFormProps {
  onSearch: (placa: string, renavam: string) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [placa, setPlaca] = useState('');
  const [renavam, setRenavam] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (placa && renavam) {
      onSearch(placa.toUpperCase(), renavam);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Consult Vehicle Fines</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="placa" className="block text-sm font-medium text-gray-700 mb-1">
            License Plate (Placa)
          </label>
          <input
            id="placa"
            type="text"
            value={placa}
            onChange={(e) => setPlaca(e.target.value.toUpperCase())}
            placeholder="ABC1234"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all uppercase"
            maxLength={7}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="renavam" className="block text-sm font-medium text-gray-700 mb-1">
            Renavam
          </label>
          <input
            id="renavam"
            type="text"
            value={renavam}
            onChange={(e) => setRenavam(e.target.value.replace(/\D/g, ''))}
            placeholder="12345678900"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            maxLength={11}
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !placa || !renavam}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium transition-colors ${
            isLoading
              ? 'bg-primary-500/70 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800'
          }`}
        >
          {isLoading ? (
            <>
              <LoaderIcon className="animate-spin w-5 h-5" />
              <span>Consulting (approx. 20s)...</span>
            </>
          ) : (
            <>
              <SearchIcon className="w-5 h-5" />
              <span>Search Fines</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;