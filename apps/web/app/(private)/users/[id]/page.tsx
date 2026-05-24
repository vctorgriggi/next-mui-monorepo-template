'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CustomTextField from '@template/ui/CustomTextField';
import ErrorState from '@template/ui/ErrorState';
import { FormGrid } from '@template/ui/FormGrid';
import { notifyError, notifySuccess } from '@template/ui/notifications';
import { formatDate } from '@template/shared/date';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

import ArrowBackLink from '@/components/ArrowBackLink';
import { useBreadcrumbs } from '@/components/layout/BreadcrumbContext';
import { APP_ROUTES } from '@/constants/app-routes';
import {
  ROLE_COLORS,
  ROLE_LABELS,
  USER_ROLES,
  userSchema,
  type UserValues,
  useUpdateUser,
  useUser,
} from '@/features/users';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, isError, refetch } = useUser(id ?? null);

  useBreadcrumbs([
    { label: 'Users', href: APP_ROUTES.private.users },
    { label: user?.name ?? '', href: APP_ROUTES.private.user(id ?? '') },
  ]);

  const updateMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserValues>({ resolver: zodResolver(userSchema) });

  React.useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email, role: user.role });
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<UserValues> = async (values) => {
    if (!user) return;
    try {
      await updateMutation.mutateAsync({ id: user.id, input: values });
      notifySuccess('User updated');
    } catch (err) {
      notifyError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  if (isError) {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <ErrorState
          title="Failed to load user"
          message="The user couldn't be loaded."
          onRetry={refetch}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <ArrowBackLink label="Users" href={APP_ROUTES.private.users} />
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        {isLoading ? <Skeleton width={200} /> : user?.name}
      </Typography>

      {isLoading || !user ? (
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={120} />
          <Skeleton variant="rounded" height={300} />
        </Stack>
      ) : (
        <FormGrid.Root>
          <FormGrid.Card>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormGrid.CardContent>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Profile
                </Typography>
                <FormGrid.Inputs>
                  <FormControl>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <CustomTextField
                      {...register('name')}
                      id="name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <CustomTextField
                      {...register('email')}
                      id="email"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="role">Role</FormLabel>
                    <CustomTextField
                      {...register('role')}
                      id="role"
                      select
                      defaultValue={user.role}
                      error={!!errors.role}
                      helperText={errors.role?.message}
                    >
                      {USER_ROLES.map((r) => (
                        <MenuItem key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </FormControl>
                </FormGrid.Inputs>
              </FormGrid.CardContent>
              <FormGrid.CardActions>
                <Button
                  variant="outlined"
                  component={Link}
                  href={APP_ROUTES.private.users}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  disabled={!isDirty}
                >
                  Save changes
                </Button>
              </FormGrid.CardActions>
            </form>
          </FormGrid.Card>
          <FormGrid.Aside>
            <FormGrid.Card>
              <FormGrid.CardContent>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Preview
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 56, height: 56 }}>
                    {user.name.charAt(0)}
                  </Avatar>
                  <Stack spacing={0.5}>
                    <Typography variant="body2" fontWeight={500}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2, flexWrap: 'wrap' }}
                >
                  <Chip
                    label={ROLE_LABELS[user.role]}
                    color={ROLE_COLORS[user.role]}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={user.active ? 'Active' : 'Inactive'}
                    color={user.active ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 2 }}
                >
                  Joined on {formatDate(user.created_at)}
                </Typography>
              </FormGrid.CardContent>
            </FormGrid.Card>
          </FormGrid.Aside>
        </FormGrid.Root>
      )}
    </Box>
  );
}
