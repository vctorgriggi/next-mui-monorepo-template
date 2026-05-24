import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  icon?: React.ComponentType<SvgIconProps>;
}

export default function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  icon: Icon = ErrorOutlineRoundedIcon,
}: ErrorStateProps) {
  return (
    <Stack
      spacing={1.5}
      sx={{ alignItems: 'center', justifyContent: 'center', py: 8 }}
    >
      <Icon sx={{ fontSize: 48, color: 'action.disabled' }} />
      <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
        <Typography variant="h6">{title}</Typography>
        {message && (
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        )}
      </Stack>
      {onRetry && (
        <Button variant="outlined" size="small" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Stack>
  );
}
