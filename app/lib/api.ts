import axios from 'axios';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

const API_BASE = 'https://api.openweathermap.org';

export interface CurrentWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  pressure: number;
  city: string;
  country: string;
  timezone: number;
}

export interface ForecastDay {
  date: string;
  temp_max: number;
  temp_min: number;
  main: string;
  description: string;
  icon: string;
  pop: number;
  humidity: number;
  wind_speed: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  feels_like: number;
  main: string;
  description: string;
  icon: string;
  pop: number;
  humidity: number;
  wind_speed: number;
}

export interface AQIData {
  aqi: number;
  components: {
    pm2_5: number;
    pm10: number;
    no2: number;
    o3: number;
  };
}

const WEATHER_ICONS: Record<string, string> = {
  '01d': '☀️',
  '01n': '🌙',
  '02d': '⛅',
  '02n': '🌙',
  '03d': '☁️',
  '03n': '☁️',
  '04d': '☁️',
  '04n': '☁️',
  '09d': '🌧️',
  '09n': '🌧️',
  '10d': '🌧️',
  '10n': '🌧️',
  '11d': '⛈️',
  '11n': '⛈️',
  '13d': '❄️',
  '13n': '❄️',
  '50d': '🌫️',
  '50n': '🌫️',
};

export const getWeatherIcon = (icon: string): string => {
  return WEATHER_ICONS[icon] || '🌤️';
};

export async function getCurrentWeather(
  city: string,
  apiKey: string
): Promise<CurrentWeather> {
  const response = await axios.get(
    `${API_BASE}/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
  );

  const data = response.data;
  return {
    id: data.weather[0].id,
    main: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    temp: Math.round(data.main.temp),
    feels_like: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    wind_speed: Math.round(data.wind.speed * 10) / 10,
    wind_deg: data.wind.deg,
    pressure: data.main.pressure,
    city: data.name,
    country: data.sys.country,
    timezone: data.timezone,
  };
}

export async function getForecast(
  lat: number,
  lon: number,
  apiKey: string
): Promise<{ daily: ForecastDay[]; hourly: HourlyForecast[] }> {
  const response = await axios.get(
    `${API_BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );

  const data = response.data;
  const daily: Record<string, ForecastDay> = {};
  const hourly: HourlyForecast[] = [];

  data.list.forEach((item: any, index: number) => {
    const date = new Date(item.dt * 1000);
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Hourly forecast (first 24 hours)
    if (index < 8) {
      hourly.push({
        time: timeStr,
        temp: Math.round(item.main.temp),
        feels_like: Math.round(item.main.feels_like),
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        pop: Math.round(item.pop * 100),
        humidity: item.main.humidity,
        wind_speed: Math.round(item.wind.speed * 10) / 10,
      });
    }

    // Daily forecast
    if (!daily[dateStr]) {
      daily[dateStr] = {
        date: dateStr,
        temp_max: item.main.temp_max,
        temp_min: item.main.temp_min,
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        pop: item.pop,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
      };
    } else {
      daily[dateStr].temp_max = Math.max(daily[dateStr].temp_max, item.main.temp_max);
      daily[dateStr].temp_min = Math.min(daily[dateStr].temp_min, item.main.temp_min);
    }
  });

  return {
    daily: Object.values(daily).slice(0, 7),
    hourly,
  };
}

export async function getAirQuality(
  lat: number,
  lon: number,
  apiKey: string
): Promise<AQIData> {
  const response = await axios.get(
    `${API_BASE}/data/3.0/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
  );

  const data = response.data.list[0];
  return {
    aqi: data.main.aqi,
    components: {
      pm2_5: Math.round(data.components.pm2_5 * 10) / 10,
      pm10: Math.round(data.components.pm10 * 10) / 10,
      no2: Math.round(data.components.no2),
      o3: Math.round(data.components.o3),
    },
  };
}

export async function geocodeCity(
  city: string,
  apiKey: string
): Promise<{ lat: number; lon: number; name: string; country: string }> {
  const response = await axios.get(
    `${API_BASE}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
  );

  if (!response.data.length) {
    throw new Error('City not found');
  }

  const data = response.data[0];
  return {
    lat: data.lat,
    lon: data.lon,
    name: data.name,
    country: data.country,
  };
}

export async function reverseGeocode(
  lat: number,
  lon: number,
  apiKey: string
): Promise<string> {
  const response = await axios.get(
    `${API_BASE}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
  );

  if (!response.data.length) {
    return 'Unknown Location';
  }

  return response.data[0].name || 'Unknown Location';
}

// TanStack Query Hooks

export function useCurrentWeather(
  city: string,
  apiKey: string
): UseQueryResult<CurrentWeather> {
  return useQuery({
    queryKey: ['weather', 'current', city],
    queryFn: () => getCurrentWeather(city, apiKey),
    enabled: !!city && !!apiKey,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });
}

export function useForecast(
  lat: number | null,
  lon: number | null,
  apiKey: string
): UseQueryResult<{ daily: ForecastDay[]; hourly: HourlyForecast[] }> {
  return useQuery({
    queryKey: ['weather', 'forecast', lat, lon],
    queryFn: () => getForecast(lat!, lon!, apiKey),
    enabled: lat !== null && lon !== null && !!apiKey,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useAirQuality(
  lat: number | null,
  lon: number | null,
  apiKey: string
): UseQueryResult<AQIData> {
  return useQuery({
    queryKey: ['weather', 'aqi', lat, lon],
    queryFn: () => getAirQuality(lat!, lon!, apiKey),
    enabled: lat !== null && lon !== null && !!apiKey,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
