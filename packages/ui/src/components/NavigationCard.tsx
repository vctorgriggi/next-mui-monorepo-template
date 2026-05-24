'use client';

import type { CardProps } from '@mui/material/Card';
import Card from '@mui/material/Card';
import type { Theme } from '@mui/material/styles';
import Link from 'next/link';

interface Props extends Omit<CardProps, 'component' | 'href'> {
  href: string;
}

export default function NavigationCard({ href, sx, children, ...rest }: Props) {
  return (
    <Card
      variant="outlined"
      // MUI requires a generic overload for the polymorphic `component` prop —
      // pragmatic cast per the MUI composition docs.
      component={Link as React.ElementType}
      href={href}
      sx={[
        {
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          transition: (theme: Theme) =>
            theme.transitions.create(['border-color'], {
              duration: theme.transitions.duration.shortest,
            }),
          '&:hover': { borderColor: 'primary.main' },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {children}
    </Card>
  );
}
