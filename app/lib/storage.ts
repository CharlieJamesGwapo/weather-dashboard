export interface WeatherSettings {
  apiKey: string;
  darkMode: boolean;
  lastCity: string;
  unit: 'metric' | 'imperial';
}

export interface FavoriteCity {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

const STORAGE_KEYS = {
  API_KEY: 'weather_api_key',
  FAVORITES: 'weather_favorites',
  DARK_MODE: 'weather_dark_mode',
  LAST_CITY: 'weather_last_city',
  UNIT: 'weather_unit',
};

export const storage = {
  // API Key
  getApiKey: (): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
  },

  setApiKey: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
  },

  // Favorites
  getFavorites: (): FavoriteCity[] => {
    if (typeof window === 'undefined') return [];
    const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  },

  addFavorite: (city: FavoriteCity): void => {
    if (typeof window === 'undefined') return;
    const favorites = storage.getFavorites();
    const exists = favorites.some((c) => c.name === city.name);
    if (!exists) {
      favorites.push(city);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
  },

  removeFavorite: (cityName: string): void => {
    if (typeof window === 'undefined') return;
    const favorites = storage.getFavorites().filter((c) => c.name !== cityName);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  },

  isFavorite: (cityName: string): boolean => {
    if (typeof window === 'undefined') return false;
    return storage.getFavorites().some((c) => c.name === cityName);
  },

  // Dark Mode
  getDarkMode: (): boolean => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (stored !== null) return stored === 'true';
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  setDarkMode: (isDark: boolean): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // Last City
  getLastCity: (): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(STORAGE_KEYS.LAST_CITY) || 'London';
  },

  setLastCity: (city: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.LAST_CITY, city);
  },

  // Unit
  getUnit: (): 'metric' | 'imperial' => {
    if (typeof window === 'undefined') return 'metric';
    return (localStorage.getItem(STORAGE_KEYS.UNIT) as 'metric' | 'imperial') || 'metric';
  },

  setUnit: (unit: 'metric' | 'imperial'): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.UNIT, unit);
  },

  // Initialize dark mode from storage
  initializeDarkMode: (): void => {
    if (typeof window === 'undefined') return;
    const isDark = storage.getDarkMode();
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
};
