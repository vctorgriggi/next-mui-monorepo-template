'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import Logo from '@/components/Logo';
import type { UserProps } from '@/layouts/Dshb';

import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

interface SideMenuProps {
  user: UserProps | null;
}

export default function SideMenu({ user }: SideMenuProps) {
  const displayName = user?.name ?? '—';
  const displayEmail = user?.email ?? '';

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          px: 2,
          py: 1.5,
          minHeight: 56,
          color: 'text.primary',
        }}
      >
        <Logo style={{ height: 28, width: 'auto' }} />
      </Box>
      <Divider />
      <MenuContent />
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt={displayName}
          src={user?.avatarUrl ?? undefined}
          sx={{ width: 36, height: 36, flexShrink: 0 }}
        />
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Typography
            variant="body2"
            sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '16px' }}
          >
            {displayName}
          </Typography>
          <Typography
            variant="caption"
            noWrap
            sx={{ color: 'text.secondary', display: 'block' }}
          >
            {displayEmail}
          </Typography>
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <OptionsMenu />
        </Box>
      </Stack>
    </Drawer>
  );
}
