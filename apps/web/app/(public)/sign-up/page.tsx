'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import CustomTextField from '@template/ui/CustomTextField';

import { APP_ROUTES } from '@/constants/app-routes';

import AuthShell from '../_components/AuthShell';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  const onSubmit: SubmitHandler<SignUpValues> = () => {
    // TODO: wire your sign-up flow here.
    router.push(APP_ROUTES.private.dashboard);
  };

  return (
    <AuthShell>
      <Typography component="h1" variant="h6">
        Create your account
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Get started in less than a minute.
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <CustomTextField
            {...register('name')}
            id="name"
            placeholder="Jane Doe"
            autoComplete="name"
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
            placeholder="you@example.com"
            autoComplete="email"
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
            placeholder="At least 8 characters"
            autoComplete="new-password"
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
          Create account
        </Button>
      </Box>
      <Divider>or</Divider>
      <Typography sx={{ textAlign: 'center' }} variant="body2">
        Already have an account?{' '}
        <Link component={NextLink} href={APP_ROUTES.public.auth.signIn}>
          Sign in
        </Link>
      </Typography>
    </AuthShell>
  );
}
