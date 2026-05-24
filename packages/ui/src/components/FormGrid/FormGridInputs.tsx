import Box from '@mui/material/Box';
import * as React from 'react';

interface FormGridInputsProps {
  children: React.ReactNode;
}

export default function FormGridInputs({ children }: FormGridInputsProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3,
      }}
    >
      {children}
    </Box>
  );
}
