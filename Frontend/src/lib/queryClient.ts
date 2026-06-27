import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Avoid refetching on window refocus
      retry: 1,                    // Retry once on failure
      staleTime: 5 * 60 * 1000,     // Consider data fresh for 5 minutes
      gcTime: 10 * 60 * 1000,      // Keep unused data in cache for 10 minutes (garbage collection time)
    },
    mutations: {
      retry: false,                // Do not retry mutating actions automatically
    },
  },
});

export default queryClient;
