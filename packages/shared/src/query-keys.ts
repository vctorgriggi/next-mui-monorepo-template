/**
 * Factory for React Query keys.
 *
 * Generates a consistent shape per domain so cache invalidation never
 * mismatches the query that wrote the entry:
 *
 *   const userKeys = createQueryKeys('users');
 *   userKeys.all           // ['users']
 *   userKeys.lists()       // ['users', 'list']
 *   userKeys.detail('42')  // ['users', 'detail', '42']
 *
 * Extend by spreading the base when a domain needs extra branches:
 *
 *   const base = createQueryKeys('campaigns');
 *   export const campaignKeys = {
 *     ...base,
 *     snapshots: (id: string) =>
 *       [...base.all, 'detail', id, 'snapshots'] as const,
 *   };
 */
export function createQueryKeys(domain: string) {
  return {
    all: [domain] as const,
    lists: () => [domain, 'list'] as const,
    detail: (id: string) => [domain, 'detail', id] as const,
  };
}
