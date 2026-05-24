import Card from '@mui/material/Card';
import * as React from 'react';

interface FormGridCardProps {
  children: React.ReactNode;
}

export default function FormGridCard({ children }: FormGridCardProps) {
  return <Card sx={{ flex: 1 }}>{children}</Card>;
}
