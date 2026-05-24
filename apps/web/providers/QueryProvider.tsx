'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

import { createQueryClient } from './query-client';

/**
 * Wraps the client subtree with a React Query client.
 *
 * Note: `useState(() => …)` ensures we create the client once per
 * mount, not on every render. If you add SSR prefetch later, swap this
 * for a `HydrationBoundary` setup — see TanStack Query SSR docs.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => createQueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
