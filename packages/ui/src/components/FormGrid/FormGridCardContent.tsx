import CardContent from '@mui/material/CardContent';
import * as React from 'react';

interface FormGridCardProps {
  children: React.ReactNode;
}

export default function FormGridCard({ children }: FormGridCardProps) {
  return <CardContent sx={{ pb: 4, px: 1 }}>{children}</CardContent>;
}
