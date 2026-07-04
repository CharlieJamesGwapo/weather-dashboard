'use client';

import React, { useState, useEffect } from 'react';
import { useCurrentWeather, useForecast, useAirQuality, getWeatherIcon } from '@/app/lib/api';
import { storage, FavoriteCity } from '@/app/lib/storage';
import SearchBar from '@/app/components/SearchBar';
import CurrentWeatherComponent from '@/app/components/CurrentWeather';
import DayForecast from '@/app/components/DayForecast';
import HourlyForecastComponent from '@/app/components/HourlyForecast';
import AQIDisplay from '@/app/components/AQIDisplay';
import FavoritesList from '@/app/components/FavoritesList';
import DarkModeToggle from '@/app/components/DarkModeToggle';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [city, setCity] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const storedApiKey = storage.getApiKey();
    const isDark = storage.getDarkMode();
    const lastCity = storage.getLastCity();
    const favs = storage.getFavorites();

    setApiKey(storedApiKey);
    setHasApiKey(!!storedApiKey);
    setIsDarkMode(isDark);
    setFavorites(favs);

    // Initialize dark mode
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Try to get user's geolocation
    if (navigator.geolocation && storedApiKey) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleGeolocation(position.coords.latitude, position.coords.longitude, storedApiKey);
        },
        () => {
          // Fallback to last city if geolocation fails
          if (lastCity) {
            setCity(lastCity);
          }
        }
      );
    } else if (lastCity && storedApiKey) {
      setCity(lastCity);
    }
  }, []);

  const handleGeolocation = async (latitude: number, longitude: number, key: string) => {
    try {
      setLat(latitude);
      setLon(longitude);
      // Don't set city name here, let it be fetched from the weather API
      // The weather API will return the city name
    } catch (err) {
      console.error('Geolocation error:', err);
    }
  };

  const handleSearch = (searchCity: string, searchLat: number, searchLon: number) => {
    setCity(searchCity);
    setLat(searchLat);
    setLon(searchLon);
    storage.setLastCity(searchCity);
    setError('');
  };

  const handleDarkModeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
    storage.setDarkMode(isDark);
  };

  const handleAddFavorite = () => {
    if (currentWeatherData && lat !== null && lon !== null) {
      const favorite: FavoriteCity = {
        name: currentWeatherData.city,
        lat,
        lon,
        country: currentWeatherData.country,
      };
      storage.addFavorite(favorite);
      setFavorites(storage.getFavorites());
    }
  };

  const handleRemoveFavorite = () => {
    if (currentWeatherData) {
      storage.removeFavorite(currentWeatherData.city);
      setFavorites(storage.getFavorites());
    }
  };

  const handleSelectFavorite = (favorite: FavoriteCity) => {
    setCity(favorite.name);
    setLat(favorite.lat);
    setLon(favorite.lon);
    storage.setLastCity(favorite.name);
  };

  // TanStack Query hooks
  const currentWeatherQuery = useCurrentWeather(city, apiKey);
  const forecastQuery = useForecast(lat, lon, apiKey);
  const aqiQuery = useAirQuality(lat, lon, apiKey);

  const currentWeatherData = currentWeatherQuery.data;
  const forecastData = forecastQuery.data;
  const aqiData = aqiQuery.data;

  const isFavorite =
    currentWeatherData ? storage.isFavorite(currentWeatherData.city) : false;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Weather Dashboard
          </h1>
          <DarkModeToggle isDark={isDarkMode} onToggle={handleDarkModeToggle} />
        </div>

        {/* API Key Setup */}
        {!hasApiKey && (
          <div className="mb-8 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-xl p-6">
            <p className="text-yellow-800 dark:text-yellow-200 mb-4">
              Please set your OpenWeather API key to get started.
            </p>
            <a
              href="/settings"
              className="inline-block px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
            >
              Go to Settings →
            </a>
          </div>
        )}

        {/* Search Bar */}
        {apiKey && (
          <div className="mb-8 flex justify-center">
            <SearchBar onSearch={handleSearch} apiKey={apiKey} isLoading={isLoading} />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl p-4 text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Main Content */}
        {apiKey && city ? (
          <>
            {currentWeatherQuery.isLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-2xl text-gray-600 dark:text-gray-400">Loading...</div>
              </div>
            ) : currentWeatherQuery.isError ? (
              <div className="text-center text-red-600 dark:text-red-400 py-12">
                <p className="text-xl">Error loading weather data. Please try again.</p>
              </div>
            ) : currentWeatherData ? (
              <>
                {/* Current Weather */}
                <div className="mb-8">
                  <CurrentWeatherComponent
                    data={currentWeatherData}
                    onAddFavorite={handleAddFavorite}
                    onRemoveFavorite={handleRemoveFavorite}
                    isFavorite={isFavorite}
                  />
                </div>

                {/* Hourly Forecast */}
                {forecastData && forecastData.hourly.length > 0 && (
                  <div className="mb-8">
                    <HourlyForecastComponent hours={forecastData.hourly} />
                  </div>
                )}

                {/* 7-Day Forecast */}
                {forecastData && forecastData.daily.length > 0 && (
                  <div className="mb-8">
                    <DayForecast days={forecastData.daily} />
                  </div>
                )}

                {/* Air Quality */}
                {aqiQuery.isLoading ? (
                  <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg h-96 flex items-center justify-center">
                    <div className="text-gray-600 dark:text-gray-400">Loading AQI...</div>
                  </div>
                ) : aqiData ? (
                  <div className="mb-8">
                    <AQIDisplay data={aqiData} />
                  </div>
                ) : null}

                {/* Favorites List */}
                {favorites.length > 0 && (
                  <div className="mb-8">
                    <FavoritesList
                      favorites={favorites}
                      onSelectFavorite={handleSelectFavorite}
                      currentCity={currentWeatherData.city}
                    />
                  </div>
                )}
              </>
            ) : null}
          </>
        ) : apiKey ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              Start by searching for a city above
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
