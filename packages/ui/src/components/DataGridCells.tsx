'use client';

import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { formatDate, formatDateTime } from '@template/shared/date';

const baseSx = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
} as const;

/** Primary text cell — bold, used for titles */
export function PrimaryCell({ value }: { value: string }) {
  return (
    <Typography variant="body2" sx={{ ...baseSx, fontWeight: 500 }}>
      {value}
    </Typography>
  );
}

/** Secondary text cell — muted, with tooltip on overflow. Shows "—" if empty. */
export function SecondaryCell({ value }: { value?: string | null }) {
  if (!value) {
    return (
      <Typography variant="body2" sx={{ ...baseSx, color: 'text.disabled' }}>
        —
      </Typography>
    );
  }

  return (
    <Tooltip title={value} enterDelay={500}>
      <Typography
        variant="body2"
        sx={{
          ...baseSx,
          color: 'text.secondary',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </Typography>
    </Tooltip>
  );
}

/** Date cell — caption size. Shows "—" if empty. */
export function DateCell({
  value,
  withTime,
}: {
  value?: string | null;
  withTime?: boolean;
}) {
  if (!value) {
    return (
      <Typography variant="caption" sx={{ ...baseSx, color: 'text.disabled' }}>
        —
      </Typography>
    );
  }

  return (
    <Typography variant="caption" sx={{ ...baseSx, color: 'text.secondary' }}>
      {withTime ? formatDateTime(value) : formatDate(value)}
    </Typography>
  );
}
