'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 1000 * 60,
            gcTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(
    () =>
      useAuthStore.subscribe((state, previous) => {
        if (state.admin?.id !== previous.admin?.id || state.admin?.role !== previous.admin?.role) {
          queryClient.clear();
        }
      }),
    [queryClient]
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
