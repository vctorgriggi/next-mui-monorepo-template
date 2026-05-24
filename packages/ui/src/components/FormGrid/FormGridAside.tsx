import Stack from '@mui/material/Stack';
import * as React from 'react';

interface FormGridAsideProps {
  children: React.ReactNode;
}

export default function FormGridAside({ children }: FormGridAsideProps) {
  return (
    <Stack
      spacing={3}
      sx={{ width: { xs: '100%', md: '30%' }, height: '100%' }}
    >
      {children}
    </Stack>
  );
}
