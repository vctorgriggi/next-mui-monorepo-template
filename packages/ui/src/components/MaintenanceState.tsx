import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import Stack from '@mui/material/Stack';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

interface MaintenanceStateProps {
  title?: string;
  message?: string;
  icon?: React.ComponentType<SvgIconProps>;
}

export default function MaintenanceState({
  title = 'Come back a bit later',
  message,
  icon: Icon = ConstructionRoundedIcon,
}: MaintenanceStateProps) {
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
    </Stack>
  );
}
