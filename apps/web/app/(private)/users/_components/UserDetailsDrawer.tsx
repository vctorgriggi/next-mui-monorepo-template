'use client';

import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { formatDate } from '@template/shared/date';
import {
  StyledTableCell,
  StyledTableRow,
} from '@template/ui/StyledTable';
import Link from 'next/link';

import { AppDrawer } from '@/components/layout/AppDrawer';
import { APP_ROUTES } from '@/constants/app-routes';
import { ROLE_COLORS, ROLE_LABELS, type User } from '@/features/users';

interface UserDetailsDrawerProps {
  user: User | null;
  onClose: () => void;
}

/**
 * Side drawer that previews a user without leaving the listing.
 *
 * Pattern: "quick look" from a DataGrid row — open with the eye icon in
 * the actions column. The Edit button at the top navigates to the full
 * detail page (`/users/[id]`) where every field is editable.
 */
export default function UserDetailsDrawer({
  user,
  onClose,
}: UserDetailsDrawerProps) {
  return (
    <AppDrawer open={!!user} onClose={onClose} title={user?.name ?? ''}>
      {user && (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 48, height: 48 }}>
                {user.name.charAt(0)}
              </Avatar>
              <Stack>
                <Typography variant="body2" fontWeight={500}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Stack>
            </Stack>
            <Button
              variant="text"
              size="small"
              component={Link}
              href={APP_ROUTES.private.user(user.id)}
              startIcon={<EditRoundedIcon fontSize="small" />}
            >
              Edit
            </Button>
          </Stack>

          <Typography component="h3" variant="subtitle2">
            Details
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    Role
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={ROLE_LABELS[user.role]}
                      color={ROLE_COLORS[user.role]}
                      size="small"
                      variant="outlined"
                    />
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    Status
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={user.active ? 'Active' : 'Inactive'}
                      color={user.active ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    Joined
                  </StyledTableCell>
                  <StyledTableCell>
                    {formatDate(user.created_at)}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    ID
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontFamily: 'monospace' }}>
                    {user.id}
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </AppDrawer>
  );
}
