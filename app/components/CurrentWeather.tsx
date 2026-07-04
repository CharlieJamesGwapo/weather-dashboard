'use client';

import React from 'react';
import { CurrentWeather, getWeatherIcon } from '@/app/lib/api';

interface CurrentWeatherProps {
  data: CurrentWeather;
  onAddFavorite: () => void;
  onRemoveFavorite: () => void;
  isFavorite: boolean;
}

export default function CurrentWeatherComponent({
  data,
  onAddFavorite,
  onRemoveFavorite,
  isFavorite,
}: CurrentWeatherProps) {
  const getWindDirection = (deg: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(((deg % 360) + 360) % 360 / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-800 dark:to-blue-900 rounded-2xl p-8 text-white shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-4xl font-bold">{data.city}, {data.country}</h2>
          <p className="text-blue-100 text-lg capitalize">{data.description}</p>
        </div>
        <button
          onClick={isFavorite ? onRemoveFavorite : onAddFavorite}
          className={`text-4xl transition-transform hover:scale-110 ${
            isFavorite ? 'text-yellow-300' : 'text-white/60 hover:text-white'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="text-center">
          <div className="text-7xl mb-2">{getWeatherIcon(data.icon)}</div>
          <div className="text-6xl font-bold">{data.temp}°C</div>
          <p className="text-blue-100 text-lg">Feels like {data.feels_like}°C</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
            <p className="text-blue-100 text-sm">Humidity</p>
            <p className="text-3xl font-bold">{data.humidity}%</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
            <p className="text-blue-100 text-sm">Pressure</p>
            <p className="text-3xl font-bold">{data.pressure}</p>
            <p className="text-xs text-blue-100">mb</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur col-span-2">
            <p className="text-blue-100 text-sm">Wind</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{data.wind_speed}</p>
              <div className="text-right">
                <p className="text-xs text-blue-100">m/s</p>
                <p className="text-sm text-blue-100">{getWindDirection(data.wind_deg)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
        <p className="text-blue-100 text-sm mb-2">Last updated</p>
        <p className="text-sm text-blue-100">
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
