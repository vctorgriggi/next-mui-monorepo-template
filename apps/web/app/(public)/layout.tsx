import { AppTheme } from '@template/ui/theme';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in · Next.js MUI Template',
};

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppTheme>{children}</AppTheme>;
}
