    import { QueryClient } from "@tanstack/react-query";

/**
 * Singleton QueryClient instance that can be imported anywhere in the app
 * This allows us to clear the cache from any service or component
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

/**
 * Helper function to clear all React Query cache
 * Can be called from anywhere in the app
 */
export const clearQueryCache = () => {
  // Clearing all React Query cache
  queryClient.clear();
};

/**
 * Helper function to invalidate specific queries
 * @param queryKey - The query key or keys to invalidate
 */
export const invalidateQueries = (queryKey?: string | string[]) => {
  if (queryKey) {
    // Invalidating specific queries
    queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
  } else {
    // Invalidating all queries
    queryClient.invalidateQueries();
  }
};