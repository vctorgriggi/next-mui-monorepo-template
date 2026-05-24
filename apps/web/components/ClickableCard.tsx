'use client';

import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import Card from '@mui/material/Card';
import CardActionArea, {
  cardActionAreaClasses,
} from '@mui/material/CardActionArea';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface ClickableCardProps {
  href?: string;
  children: ReactNode;
}

export default function ClickableCard({ href, children }: ClickableCardProps) {
  if (!href) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        {children}
      </Card>
    );
  }

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        position: 'relative',
        transition: 'border-color 0.15s',
        '&:hover': {
          borderColor: 'primary.main',
          '& .clickable-card-arrow': { color: 'primary.main' },
        },
      }}
    >
      <NorthEastRoundedIcon
        fontSize="small"
        className="clickable-card-arrow"
        sx={(theme) => ({
          position: 'absolute',
          top: theme.spacing(1.5),
          right: theme.spacing(1.5),
          color: 'text.disabled',
          transition: 'color 0.15s',
          zIndex: 1,
          pointerEvents: 'none',
        })}
      />
      <CardActionArea
        component={Link}
        href={href}
        sx={{
          height: '100%',
          display: 'block',
          [`& .${cardActionAreaClasses.focusHighlight}`]: { opacity: 0 },
          [`&:hover .${cardActionAreaClasses.focusHighlight}`]: { opacity: 0 },
        }}
      >
        {children}
      </CardActionArea>
    </Card>
  );
}
