import { QueryClient } from '@tanstack/react-query';
import { CACHE_STALE_MS } from '@template/shared/cache';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CACHE_STALE_MS,
        retry: false,
      },
    },
  });
}
