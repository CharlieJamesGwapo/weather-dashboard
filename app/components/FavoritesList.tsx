'use client';

import React from 'react';
import { FavoriteCity } from '@/app/lib/storage';

interface FavoritesListProps {
  favorites: FavoriteCity[];
  onSelectFavorite: (city: FavoriteCity) => void;
  currentCity?: string;
}

export default function FavoritesList({
  favorites,
  onSelectFavorite,
  currentCity,
}: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Favorite Cities</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No favorite cities yet. Star a city to add it to your favorites!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Favorite Cities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {favorites.map((city) => (
          <button
            key={city.name}
            onClick={() => onSelectFavorite(city)}
            className={`p-4 rounded-lg transition-all transform hover:scale-105 ${
              currentCity === city.name
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <p className="font-semibold text-sm">{city.name}</p>
            <p className="text-xs opacity-75">{city.country}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
