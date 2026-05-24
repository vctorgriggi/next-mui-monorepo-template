'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface Props {
  title: string;
  /** Formatted string or a custom node (icon + number, etc). */
  value: React.ReactNode;
  /** Subtle line under the value. Accepts a string or a node. */
  hint?: React.ReactNode;
  /** sx color (`success.main`, `error.main`, …) applied to the value.
   *  Default: text.primary. */
  valueColor?: string;
}

/**
 * Small KPI card for dashboards and detail-page headers:
 * short title + large value + muted hint underneath.
 */
export default function StatCard({ title, value, hint, valueColor }: Props) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography component="h3" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{ color: valueColor ?? 'text.primary' }}
        >
          {typeof value === 'string' ? (
            <Typography
              variant="h4"
              component="p"
              sx={{ color: 'inherit', fontVariantNumeric: 'tabular-nums' }}
            >
              {value}
            </Typography>
          ) : (
            value
          )}
        </Stack>
        {typeof hint === 'string' ? (
          <Typography variant="caption" color="text.secondary">
            {hint || ' '}
          </Typography>
        ) : (
          (hint ?? (
            <Typography variant="caption" color="text.secondary">
              {' '}
            </Typography>
          ))
        )}
      </CardContent>
    </Card>
  );
}
