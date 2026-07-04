'use client';

import React from 'react';
import { ForecastDay, getWeatherIcon } from '@/app/lib/api';

interface DayForecastProps {
  days: ForecastDay[];
}

export default function DayForecast({ days }: DayForecastProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">7-Day Forecast</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {days.map((day) => (
          <div
            key={day.date}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
          >
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {formatDate(day.date)}
            </p>
            <div className="text-4xl mb-3">{getWeatherIcon(day.icon)}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 capitalize mb-3">
              {day.description}
            </p>
            <div className="flex justify-center gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">High</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {Math.round(day.temp_max)}°C
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Low</p>
                <p className="text-lg font-bold text-gray-600 dark:text-gray-300">
                  {Math.round(day.temp_min)}°C
                </p>
              </div>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-600 pt-3 grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Rain</p>
                <p className="font-semibold text-gray-900 dark:text-white">{Math.round(day.pop)}%</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Humidity</p>
                <p className="font-semibold text-gray-900 dark:text-white">{day.humidity}%</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Wind</p>
                <p className="font-semibold text-gray-900 dark:text-white">{Math.round(day.wind_speed)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
