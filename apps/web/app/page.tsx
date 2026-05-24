import { redirect } from 'next/navigation';

import { APP_ROUTES } from '@/constants/app-routes';

/**
 * Root entry. The template ships with no real auth, so we redirect
 * straight to the dashboard. When you wire your auth provider, switch
 * this to redirect to `APP_ROUTES.public.auth.signIn` (or check the
 * session here and branch).
 */
export default function Page() {
  redirect(APP_ROUTES.private.dashboard);
}
