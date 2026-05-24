'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import * as React from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import CustomTextField from '@template/ui/CustomTextField';
import { notifySuccess } from '@template/ui/notifications';

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
}

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword({ open, onClose }: ForgotPasswordProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit: SubmitHandler<ForgotPasswordValues> = () => {
    // TODO: wire your password-reset flow here.
    notifySuccess("If that email exists, we'll send reset instructions.");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
          e.stopPropagation();
          handleSubmit(onSubmit)(e);
        },
      }}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Forgot your password?</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Enter the email tied to your account and we&apos;ll send instructions
          to reset your password.
        </DialogContentText>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <CustomTextField
            {...register('email')}
            id="email"
            type="email"
            placeholder="you@example.com"
            error={!!errors.email}
            helperText={errors.email?.message}
            autoFocus
          />
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          Send instructions
        </Button>
      </DialogActions>
    </Dialog>
  );
}
