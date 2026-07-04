'use client';

import React, { useState, useRef, useEffect } from 'react';
import { geocodeCity } from '@/app/lib/api';

interface SearchBarProps {
  onSearch: (city: string, lat: number, lon: number) => void;
  apiKey: string;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, apiKey, isLoading }: SearchBarProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleInputChange = (value: string) => {
    setInput(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce the search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setSearchLoading(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        // Simulate autocomplete with common cities
        const commonCities = [
          'London', 'New York', 'Tokyo', 'Paris', 'Sydney',
          'Dubai', 'Singapore', 'Bangkok', 'Mumbai', 'Delhi',
          'Beijing', 'Shanghai', 'Hong Kong', 'Los Angeles', 'Chicago',
          'Madrid', 'Rome', 'Amsterdam', 'Vienna', 'Berlin',
          'Toronto', 'Vancouver', 'Melbourne', 'Auckland', 'Cape Town',
        ];

        const filtered = commonCities.filter((city) =>
          city.toLowerCase().startsWith(value.toLowerCase())
        );

        setSuggestions(filtered);
        setShowSuggestions(true);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const handleSelectSuggestion = async (city: string) => {
    setInput(city);
    setShowSuggestions(false);
    setSearchLoading(true);

    try {
      const geocoded = await geocodeCity(city, apiKey);
      onSearch(geocoded.name, geocoded.lat, geocoded.lon);
    } catch (error) {
      console.error('Failed to geocode city:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setSearchLoading(true);
    try {
      const geocoded = await geocodeCity(input, apiKey);
      onSearch(geocoded.name, geocoded.lat, geocoded.lon);
      setInput('');
      setSuggestions([]);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Failed to search city:', error);
      alert('City not found. Please try another search.');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => input && setShowSuggestions(true)}
          placeholder="Search for a city..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading || searchLoading}
        />
        <button
          type="submit"
          disabled={isLoading || searchLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md transition-colors"
        >
          {searchLoading ? (
            <span className="inline-block animate-spin">⌛</span>
          ) : (
            '🔍'
          )}
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
          {suggestions.map((city) => (
            <button
              key={city}
              onClick={() => handleSelectSuggestion(city)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
