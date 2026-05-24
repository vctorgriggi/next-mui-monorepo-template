'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CustomTextField from '@template/ui/CustomTextField';
import { FormGrid } from '@template/ui/FormGrid';
import { notifyError, notifySuccess } from '@template/ui/notifications';
import * as React from 'react';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';

import {
  accountSchema,
  type AccountValues,
  useMyAccount,
  useUpdateMyAccount,
} from '@/features/account';

export default function AccountPage() {
  const { data: account, isLoading } = useMyAccount();
  const updateMutation = useUpdateMyAccount();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AccountValues>({ resolver: zodResolver(accountSchema) });

  // Live values for the preview aside.
  const watched = useWatch({ control });

  React.useEffect(() => {
    if (account) {
      reset({
        name: account.name,
        email: account.email,
        bio: account.bio ?? '',
      });
    }
  }, [account, reset]);

  const onSubmit: SubmitHandler<AccountValues> = async (values) => {
    try {
      await updateMutation.mutateAsync(values);
      notifySuccess('Profile updated');
      reset(values); // mark form as pristine
    } catch (err) {
      notifyError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Account
      </Typography>

      {isLoading || !account ? (
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={400} />
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
                </FormGrid.Inputs>
                <FormControl sx={{ mt: 3 }}>
                  <FormLabel htmlFor="bio">Bio</FormLabel>
                  <CustomTextField
                    {...register('bio')}
                    id="bio"
                    multiline
                    minRows={3}
                    placeholder="A short blurb about yourself…"
                    error={!!errors.bio}
                    helperText={
                      errors.bio?.message ??
                      'Visible on your public profile. 280 characters max.'
                    }
                  />
                </FormControl>
              </FormGrid.CardContent>
              <FormGrid.CardActions>
                <Button
                  variant="outlined"
                  onClick={() =>
                    reset({
                      name: account.name,
                      email: account.email,
                      bio: account.bio ?? '',
                    })
                  }
                  disabled={!isDirty || isSubmitting}
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
                {(() => {
                  const previewName = watched.name ?? account.name;
                  const previewEmail = watched.email ?? account.email;
                  const previewBio = watched.bio ?? account.bio;
                  return (
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 56, height: 56 }}>
                          {previewName.charAt(0)}
                        </Avatar>
                        <Stack spacing={0.5}>
                          <Typography variant="body2" fontWeight={500}>
                            {previewName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {previewEmail}
                          </Typography>
                        </Stack>
                      </Stack>
                      {previewBio && (
                        <Typography variant="body2" color="text.secondary">
                          {previewBio}
                        </Typography>
                      )}
                    </Stack>
                  );
                })()}
              </FormGrid.CardContent>
            </FormGrid.Card>
          </FormGrid.Aside>
        </FormGrid.Root>
      )}
    </Box>
  );
}
