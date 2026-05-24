'use client';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { type ReactNode } from 'react';

interface AppDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function AppDrawer({ open, onClose, title, children }: AppDrawerProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: {
            xs: '100vw',
            sm: '80vw',
            md: '60vw',
            lg: '40vw',
            xl: '20vw',
          },
          display: 'flex',
          flexDirection: 'column',
        }}
        role="presentation"
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          py={2.5}
          px={3}
        >
          <Typography
            component="h2"
            variant="h6"
            sx={{ color: 'text.primary' }}
          >
            {title}
          </Typography>
          <IconButton onClick={onClose} aria-label="close" size="small">
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={3} py={2.5} px={3}>
          {children}
        </Stack>
      </Box>
    </Drawer>
  );
}
