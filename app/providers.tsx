'use client';

import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { storage } from '@/app/lib/storage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize dark mode from storage
    storage.initializeDarkMode();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
