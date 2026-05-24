'use client';

import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { tabsClasses } from '@mui/material/Tabs';
import MuiToolbar from '@mui/material/Toolbar';
import { ColorModeIconDropdown } from '@template/ui/theme';
import { useState } from 'react';

import Logo from '@/components/Logo';
import type { UserProps } from '@/layouts/Dshb';

import MenuButton from './MenuButton';
import SideMenuMobile from './SideMenuMobile';

const Toolbar = styled(MuiToolbar)({
  width: '100%',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '12px',
  flexShrink: 0,
  [`& ${tabsClasses.flexContainer}`]: {
    gap: '8px',
    p: '8px',
    pb: 0,
  },
});

interface AppNavbarProps {
  user: UserProps | null;
}

export default function AppNavbar({ user }: AppNavbarProps) {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: 'auto', md: 'none' },
        boxShadow: 0,
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        top: 'var(--template-frame-height, 0px)',
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexGrow: 1,
            width: '100%',
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 'auto',
              color: 'text.primary',
            }}
          >
            <Logo style={{ height: 24, width: 'auto' }} />
          </Box>
          <ColorModeIconDropdown />
          <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuRoundedIcon />
          </MenuButton>
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} user={user} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
