'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { storage } from '@/app/lib/storage';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedApiKey = storage.getApiKey();
    const isDark = storage.getDarkMode();
    setApiKey(storedApiKey);
    setIsDarkMode(isDark);

    // Initialize dark mode
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      setMessageType('error');
      setMessage('API key cannot be empty');
      return;
    }

    storage.setApiKey(apiKey);
    setMessageType('success');
    setMessage('API key saved successfully!');

    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleClearApiKey = () => {
    if (confirm('Are you sure you want to clear your API key?')) {
      setApiKey('');
      storage.setApiKey('');
      setMessageType('success');
      setMessage('API key cleared');

      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const handleClearFavorites = () => {
    if (confirm('Are you sure you want to clear all favorite cities?')) {
      localStorage.setItem('weather_favorites', JSON.stringify([]));
      setMessageType('success');
      setMessage('Favorites cleared');

      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to reset all settings? This cannot be undone.')) {
      localStorage.clear();
      setApiKey('');
      setMessageType('success');
      setMessage('All settings cleared');

      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              messageType === 'success'
                ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700'
                : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'
            }`}
          >
            {message}
          </div>
        )}

        {/* API Key Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            OpenWeather API Key
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get your free API key from{' '}
            <a
              href="https://openweathermap.org/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              OpenWeatherMap
            </a>
            . The free tier includes weather data, forecasts, and air quality information.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              API Key
            </label>
            <div className="flex gap-2">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenWeather API key"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={showApiKey ? 'Hide API key' : 'Show API key'}
              >
                {showApiKey ? '👁️' : '🚫'}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveApiKey}
              className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
            >
              Save API Key
            </button>
            <button
              onClick={handleClearApiKey}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Data Management
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Favorite Cities
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Clear all your saved favorite cities.
              </p>
              <button
                onClick={handleClearFavorites}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
              >
                Clear Favorites
              </button>
            </div>

            <hr className="border-gray-300 dark:border-gray-600" />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Reset All Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Clear all data including API key, favorites, and preferences. This action cannot be
                undone.
              </p>
              <button
                onClick={handleClearAll}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-200 mb-4">About</h2>
          <ul className="text-blue-800 dark:text-blue-300 space-y-2">
            <li>• Data is cached for 10 minutes for weather and 30 minutes for air quality</li>
            <li>• Your API key is stored locally in your browser</li>
            <li>• Favorite cities are saved in localStorage</li>
            <li>• Dark mode preference is saved automatically</li>
            <li>• Geolocation is requested on first visit (optional)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
