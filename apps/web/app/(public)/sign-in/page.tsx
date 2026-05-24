'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import CustomTextField from '@template/ui/CustomTextField';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { APP_ROUTES } from '@/constants/app-routes';

import AuthShell from '../_components/AuthShell';
import ForgotPassword from '../_components/ForgotPassword';

const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [forgotOpen, setForgotOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit: SubmitHandler<SignInValues> = () => {
    // TODO: wire your sign-in flow here (Supabase, NextAuth, custom, etc.).
    // For now, any valid input lands the user on the dashboard.
    router.push(APP_ROUTES.private.dashboard);
  };

  return (
    <AuthShell>
      <Typography component="h1" variant="h6">
        Sign in
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Welcome back. Enter your credentials to continue.
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <CustomTextField
            {...register('email')}
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <CustomTextField
            {...register('password')}
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          loading={isSubmitting}
        >
          Continue
        </Button>
        <Link
          component="button"
          type="button"
          onClick={() => setForgotOpen(true)}
          variant="body2"
          sx={{ alignSelf: 'center' }}
        >
          Forgot your password?
        </Link>
      </Box>
      <Divider>or</Divider>
      <Typography sx={{ textAlign: 'center' }} variant="body2">
        Don&apos;t have an account?{' '}
        <Link component={NextLink} href={APP_ROUTES.public.auth.signUp}>
          Sign up
        </Link>
      </Typography>
      <ForgotPassword open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </AuthShell>
  );
}
