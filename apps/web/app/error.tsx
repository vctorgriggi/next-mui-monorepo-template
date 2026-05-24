'use client';

import Box from '@mui/material/Box';
import { useEffect } from 'react';

import ErrorState from '@template/ui/ErrorState';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to your monitoring service here (Sentry, Datadog, etc.)
    console.error(error);
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <ErrorState
        title="Something went wrong"
        message={error.message || 'An unexpected error occurred.'}
        onRetry={reset}
      />
    </Box>
  );
}
