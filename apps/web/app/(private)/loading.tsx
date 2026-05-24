import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

/**
 * Automatic Suspense fallback for every route under `(private)`.
 *
 * Next.js renders this whenever a server segment is loading (e.g.
 * navigating between pages that fetch on the server, or the first
 * paint when the layout itself is loading). It mirrors the canonical
 * page anatomy from `docs/design-patterns.md`:
 *
 *   - `h6` placeholder where the page title goes
 *   - `mb: 2` invariant between header and body
 *   - body inside `maxWidth: 1700px`
 *
 * Per-page Skeletons (e.g. inside `account/page.tsx`) still cover the
 * *client* loading states (React Query refetches). This file only
 * covers the *server* boundary.
 */
export default function Loading() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={120} />
        <Skeleton variant="rounded" height={320} />
      </Stack>
    </Box>
  );
}
