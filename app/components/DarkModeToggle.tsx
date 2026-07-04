'use client';

import React from 'react';

interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: (isDark: boolean) => void;
}

export default function DarkModeToggle({ isDark, onToggle }: DarkModeToggleProps) {
  return (
    <button
      onClick={() => onToggle(!isDark)}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
