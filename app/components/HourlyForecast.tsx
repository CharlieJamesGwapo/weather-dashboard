'use client';

import React from 'react';
import { HourlyForecast, getWeatherIcon } from '@/app/lib/api';

interface HourlyForecastProps {
  hours: HourlyForecast[];
}

export default function HourlyForecastComponent({ hours }: HourlyForecastProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Next 24 Hours</h3>
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-2 min-w-max">
          {hours.map((hour, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 min-w-[120px] text-center hover:shadow-lg transition-shadow"
            >
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                {hour.time}
              </p>
              <div className="text-3xl mb-2">{getWeatherIcon(hour.icon)}</div>
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {hour.temp}°C
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Feels {hour.feels_like}°C
              </p>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Rain:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{hour.pop}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Wind:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{hour.wind_speed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
