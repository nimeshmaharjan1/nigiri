import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // TanStack Query defaults (industry standard):
      // staleTime: 0 - data is immediately considered stale
      // gcTime: 5 minutes - unused data stays in cache for 5 minutes
      // refetchOnWindowFocus: true - refetch when window regains focus
      // refetchOnReconnect: true - refetch when reconnecting
      // retry: 3 - retry failed requests 3 times
      // retryDelay: exponential backoff
    },
  },
});
