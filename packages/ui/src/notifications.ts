'use client';

import { type ExternalToast, toast } from 'sonner';

export const notifySuccess = (
  message: string,
  opts: ExternalToast = {},
): string | number => toast.success(message, opts);

export const notifyError = (
  message: string,
  opts: ExternalToast = {},
): string | number => toast.error(message, opts);

export const notifyInfo = (
  message: string,
  opts: ExternalToast = {},
): string | number => toast.info(message, opts);

export const notifyWarning = (
  message: string,
  opts: ExternalToast = {},
): string | number => toast.warning(message, opts);
