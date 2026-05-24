'use client';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Copyright from '@template/ui/Copyright';
import {
  AppTheme,
  dataGridCustomizations,
  datePickersCustomizations,
} from '@template/ui/theme';
import { type ReactNode } from 'react';

import AppNavbar from '@/components/layout/AppNavbar';
import { BreadcrumbProvider } from '@/components/layout/BreadcrumbContext';
import Header from '@/components/layout/Header';
import RouteGuard from '@/components/layout/RouteGuard';
import SideMenu from '@/components/layout/SideMenu';

const xThemeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
};

export interface UserProps {
  id: string;
  email: string | null;
  name?: string | null;
  avatarUrl?: string | null;
}

interface DashboardLayoutProps {
  children: ReactNode;
  user: UserProps;
}

export default function Dshb({ children, user }: DashboardLayoutProps) {
  return (
    <AppTheme themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BreadcrumbProvider>
          <Box sx={{ display: 'flex' }}>
            <SideMenu user={user} />
            <AppNavbar user={user} />
            <Box
              component="main"
              sx={(theme) => ({
                flexGrow: 1,
                backgroundColor: alpha(theme.palette.background.default, 1),
                overflow: 'auto',
              })}
            >
              <Stack
                spacing={2}
                sx={{
                  alignItems: 'center',
                  mx: 3,
                  pb: 5,
                  mt: { xs: 8, md: 0 },
                }}
              >
                <Header />
                <Box
                  sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}
                >
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                  >
                    <RouteGuard>{children}</RouteGuard>
                  </Box>
                  <Copyright />
                </Box>
              </Stack>
            </Box>
          </Box>
        </BreadcrumbProvider>
      </LocalizationProvider>
    </AppTheme>
  );
}
