import Card from '@mui/material/Card';
import * as React from 'react';

interface FilterRootProps {
  children: React.ReactNode;
}

export default function FilterRoot({ children }: FilterRootProps) {
  return <Card sx={{ px: 2 }}>{children}</Card>;
}
