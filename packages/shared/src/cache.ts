/**
 * Default cache window in seconds, kept in sync with the React Query
 * `staleTime` default in `providers/query-client.tsx` (5 minutes). Use
 * this in `unstable_cache` (Next.js) so server-side and client-side
 * staleness stay aligned.
 */
export const CACHE_STALE_SECONDS = 300;

/** Same value in ms — use it as `staleTime` in React Query. */
export const CACHE_STALE_MS = CACHE_STALE_SECONDS * 1000;

/**
 * Long cache in seconds (1h). Use for data that changes rarely (large
 * inventories, expensive external API calls, etc.) — combine with a
 * dedicated "refresh" mutation that calls `revalidateTag` when the user
 * needs a fresh read.
 */
export const CACHE_LONG_SECONDS = 3600;
