import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient configuration with default options
 * Customize based on your application needs
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before data is considered stale (5 minutes)
      staleTime: 5 * 60 * 1000,
      // Time before inactive queries are garbage collected (10 minutes)
      gcTime: 10 * 60 * 1000, // Previously cacheTime
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay increases exponentially
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus in production, but not in development
      refetchOnWindowFocus: import.meta.env.PROD,
      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
      // Don't refetch on reconnect if data is fresh
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Retry delay
      retryDelay: 1000,
    },
  },
});
