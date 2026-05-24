'use client';

import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import {
  DateCell,
  PrimaryCell,
  SecondaryCell,
} from '@template/ui/DataGridCells';
import { DATA_GRID_DEFAULTS } from '@template/ui/DataGridDefaults';
import StatCard from '@template/ui/StatCard';

import { useUsers } from '@/features/users';

const STATS = [
  { title: 'Total users', value: '1,284', hint: '+12% vs last month' },
  { title: 'Active sessions', value: '342', hint: '+8% vs last month' },
  { title: 'Revenue', value: '$42.3K', hint: '+3.2% vs last month' },
  { title: 'Conversion', value: '4.7%', hint: '+0.4 p.p. vs last month' },
];

export default function DashboardPage() {
  const { data: users = [], isLoading } = useUsers();

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {STATS.map((stat) => (
          <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title={stat.title}
              value={stat.value}
              hint={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <ArrowUpwardRoundedIcon
                    fontSize="inherit"
                    sx={{ color: 'success.main' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {stat.hint}
                  </Typography>
                </Stack>
              }
            />
          </Grid>
        ))}
      </Grid>

      <Typography component="h3" variant="subtitle2" sx={{ mb: 1 }}>
        Recent users
      </Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          {...DATA_GRID_DEFAULTS}
          rows={users.slice(0, 5)}
          loading={isLoading}
          columns={[
            {
              field: 'name',
              headerName: 'Name',
              flex: 1,
              renderCell: (p) => <PrimaryCell value={p.value} />,
            },
            {
              field: 'email',
              headerName: 'Email',
              flex: 1,
              renderCell: (p) => <SecondaryCell value={p.value} />,
            },
            {
              field: 'created_at',
              headerName: 'Joined',
              width: 160,
              renderCell: (p) => <DateCell value={p.value} />,
            },
          ]}
          hideFooter
        />
      </Box>
    </Box>
  );
}
