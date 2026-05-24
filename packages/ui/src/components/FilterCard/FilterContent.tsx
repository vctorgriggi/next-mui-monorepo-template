import CardContent from '@mui/material/CardContent';
import * as React from 'react';

interface FilterContentProps {
  children: React.ReactNode;
}

export default function FilterContent({ children }: FilterContentProps) {
  return <CardContent>{children}</CardContent>;
}
