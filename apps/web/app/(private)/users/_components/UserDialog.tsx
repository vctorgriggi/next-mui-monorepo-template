'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';

import CustomTextField from '@template/ui/CustomTextField';
import { notifyError, notifySuccess } from '@template/ui/notifications';

import {
  ROLE_LABELS,
  useCreateUser,
  type User,
  USER_ROLES,
  userSchema,
  type UserValues,
  useUpdateUser,
} from '@/features/users';

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  /** Pass to edit, omit to create. */
  user?: User | null;
}

export default function UserDialog({ open, onClose, user }: UserDialogProps) {
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      role: user?.role ?? 'user',
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'user',
      });
    }
  }, [open, user, reset]);

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const onSubmit: SubmitHandler<UserValues> = async (values) => {
    try {
      if (isEditing && user) {
        await updateMutation.mutateAsync({ id: user.id, input: values });
        notifySuccess('User updated');
      } else {
        await createMutation.mutateAsync(values);
        notifySuccess('User created');
      }
      onClose();
    } catch (err) {
      notifyError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>{isEditing ? 'Edit user' : 'Create user'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl>
              <FormLabel htmlFor="name">Name</FormLabel>
              <CustomTextField
                {...register('name')}
                id="name"
                placeholder="Jane Doe"
                autoFocus
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
                placeholder="jane@example.com"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="role">Role</FormLabel>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    id="role"
                    select
                    error={!!errors.role}
                    helperText={errors.role?.message}
                  >
                    {USER_ROLES.map((r) => (
                      <MenuItem key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={isEditing && !isDirty}
          >
            {isEditing ? 'Save changes' : 'Create user'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
