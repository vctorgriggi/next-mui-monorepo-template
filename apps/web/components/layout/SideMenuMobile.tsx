'use client';

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { UserProps } from '@/layouts/Dshb';

import MenuContent from './MenuContent';

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
  user: UserProps | null;
}

export default function SideMenuMobile({
  open,
  toggleDrawer,
  user,
}: SideMenuMobileProps) {
  const displayName = user?.name ?? '—';

  function handleSignOut() {
    // TODO: wire your sign-out flow here, e.g.
    //   await supabase.auth.signOut();
    //   router.push(APP_ROUTES.public.auth.signIn);
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack sx={{ maxWidth: '70dvw', height: '100%' }}>
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <Avatar
              sizes="small"
              alt={displayName}
              src={user?.avatarUrl ?? undefined}
              sx={{ width: 24, height: 24 }}
            />
            <Typography component="p" variant="h6">
              {displayName}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <Button
            onClick={handleSignOut}
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
          >
            Sign out
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
