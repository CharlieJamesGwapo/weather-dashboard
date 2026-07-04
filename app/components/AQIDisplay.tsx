'use client';

import React from 'react';
import { AQIData } from '@/app/lib/api';

interface AQIDisplayProps {
  data: AQIData;
}

const AQI_LEVELS = [
  { level: 1, label: 'Good', color: 'bg-green-500', textColor: 'text-green-900', range: '1-50' },
  { level: 2, label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-900', range: '51-100' },
  { level: 3, label: 'Moderate', color: 'bg-orange-500', textColor: 'text-orange-900', range: '101-150' },
  { level: 4, label: 'Poor', color: 'bg-red-500', textColor: 'text-red-900', range: '151-200' },
  { level: 5, label: 'Very Poor', color: 'bg-purple-600', textColor: 'text-purple-900', range: '201+' },
];

export default function AQIDisplay({ data }: AQIDisplayProps) {
  const aqiLevel = AQI_LEVELS[Math.min(data.aqi - 1, AQI_LEVELS.length - 1)];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Air Quality Index</h3>

      <div className={`${aqiLevel.color} rounded-xl p-6 text-white mb-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg opacity-90">Current Status</p>
            <p className="text-4xl font-bold">{aqiLevel.label}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">AQI Value</p>
            <p className="text-5xl font-bold">{data.aqi}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AQI Scale</h4>
        <div className="space-y-2">
          {AQI_LEVELS.map((level) => (
            <div
              key={level.level}
              className={`flex items-center justify-between p-3 rounded-lg ${
                level.level === data.aqi
                  ? `${level.color} text-white`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="font-semibold">{level.label}</span>
              <span className="text-sm">{level.range}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">PM2.5</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.components.pm2_5}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">µg/m³</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">PM10</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.components.pm10}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">µg/m³</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">NO₂</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.components.no2}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">µg/m³</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">O₃</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.components.o3}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">µg/m³</p>
        </div>
      </div>
    </div>
  );
}
