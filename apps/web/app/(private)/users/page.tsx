'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import ConfirmDialog from '@template/ui/ConfirmDialog';
import {
  DateCell,
  PrimaryCell,
  SecondaryCell,
} from '@template/ui/DataGridCells';
import { DATA_GRID_DEFAULTS } from '@template/ui/DataGridDefaults';
import { notifyError, notifySuccess } from '@template/ui/notifications';
import * as React from 'react';

import {
  ROLE_COLORS,
  ROLE_LABELS,
  useDeleteUser,
  type User,
  useUsers,
} from '@/features/users';

import UserDetailsDrawer from './_components/UserDetailsDrawer';
import UserDialog from './_components/UserDialog';

export default function UsersPage() {
  const { data: users = [], isLoading } = useUsers();
  const deleteMutation = useDeleteUser();

  const [viewing, setViewing] = React.useState<User | null>(null);
  const [editing, setEditing] = React.useState<User | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<User | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      notifySuccess('User deleted');
      setDeleting(null);
    } catch (err) {
      notifyError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const columns: GridColDef<User>[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 180,
      renderCell: (p) => <PrimaryCell value={p.value} />,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
      renderCell: (p) => <SecondaryCell value={p.value} />,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (p) => (
        <Stack direction="row" alignItems="center" sx={{ height: '100%' }}>
          <Chip
            label={ROLE_LABELS[p.row.role]}
            color={ROLE_COLORS[p.row.role]}
            size="small"
            variant="outlined"
          />
        </Stack>
      ),
    },
    {
      field: 'active',
      headerName: 'Status',
      width: 110,
      renderCell: (p) => (
        <Stack direction="row" alignItems="center" sx={{ height: '100%' }}>
          <Chip
            label={p.row.active ? 'Active' : 'Inactive'}
            color={p.row.active ? 'success' : 'default'}
            size="small"
            variant="outlined"
          />
        </Stack>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Joined',
      width: 140,
      renderCell: (p) => <DateCell value={p.value} />,
    },
    {
      field: 'actions',
      headerName: '',
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (p) => (
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{ height: '100%' }}
        >
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => setViewing(p.row)}
              aria-label={`View ${p.row.name}`}
            >
              <VisibilityRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => setEditing(p.row)}
              aria-label={`Edit ${p.row.name}`}
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => setDeleting(p.row)}
              aria-label={`Delete ${p.row.name}`}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography component="h2" variant="h6">
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setCreating(true)}
        >
          New user
        </Button>
      </Stack>

      <Box sx={{ width: '100%' }}>
        <DataGrid
          {...DATA_GRID_DEFAULTS}
          rows={users}
          loading={isLoading}
          columns={columns}
          autoHeight
          pageSizeOptions={[10, 20, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        />
      </Box>

      <UserDetailsDrawer user={viewing} onClose={() => setViewing(null)} />

      <UserDialog
        open={creating || !!editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        user={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete user?"
        description={`This will permanently remove ${deleting?.name ?? 'this user'}.`}
        confirmLabel="Delete"
        confirmColor="error"
        loading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleting(null)}
      />
    </Box>
  );
}
