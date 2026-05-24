import CardActions from '@mui/material/CardActions';
import * as React from 'react';

interface FormGridCardProps {
  children: React.ReactNode;
}

export default function FormGridCard({ children }: FormGridCardProps) {
  return (
    <CardActions sx={{ justifyContent: 'flex-end', pt: 1 }}>
      {children}
    </CardActions>
  );
}
