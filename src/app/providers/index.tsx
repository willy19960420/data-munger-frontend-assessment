'use client';

import React from 'react';
import { ConfigProvider, theme as antdTheme, App as AntApp } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { useThemeStore } from '@/stores/themeStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retryDelay: 1000,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  const isDark = theme === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: isDark
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
          token: {
            fontSize: 16,
          },
        }}
      >
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}