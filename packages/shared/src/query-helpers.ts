'use client';

import { useQuery } from '@tanstack/react-query';

import { fromResult, type Result } from './result';

/**
 * Builds useQuery options for queries that depend on a nullable ID.
 * Handles the enabled/queryKey/queryFn boilerplate in one place.
 */
export function useOptionalQuery<TId extends string | number, T>(
  id: TId | null | undefined,
  keyFn: (id: TId) => readonly unknown[],
  queryFn: (id: TId) => Promise<Result<T>>,
) {
  return useQuery<T>({
    queryKey: id != null ? keyFn(id) : [],
    enabled: id != null,
    queryFn: fromResult(() => queryFn(id!)),
  });
}
