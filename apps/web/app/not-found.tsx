import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EmptyState from '@template/ui/EmptyState';
import Link from 'next/link';

import { APP_ROUTES } from '@/constants/app-routes';

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        p: 4,
      }}
    >
      <EmptyState
        title="Page not found"
        message="The page you're looking for doesn't exist or was moved."
      />
      <Button
        variant="contained"
        component={Link}
        href={APP_ROUTES.private.dashboard}
      >
        Back to dashboard
      </Button>
    </Box>
  );
}
