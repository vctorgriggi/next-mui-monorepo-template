import Box, { BoxProps } from '@mui/material/Box';
import * as React from 'react';

export default function FormGridRoot({ children, ...props }: BoxProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
