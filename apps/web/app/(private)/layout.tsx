import type { Metadata } from 'next';

import { currentAccount } from '@/features/account/data';
import Dshb from '@/layouts/Dshb';
import { QueryProvider } from '@/providers/QueryProvider';
import { RolesProvider } from '@/providers/RolesProvider';

export const metadata: Metadata = {
  title: {
    template: '%s · Next.js MUI Template',
    default: 'Next.js MUI Template',
  },
};

export default function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /*
   * Replace the mocks below with real auth + role lookup. Common shapes:
   *
   *   // Supabase
   *   const supabase = await createServerClient();
   *   const { data: { user } } = await supabase.auth.getUser();
   *   if (!user) redirect(APP_ROUTES.public.auth.signIn);
   *   const { data } = await supabase
   *     .from('user_roles').select('roles(name)').eq('user_id', user.id);
   *   const roles = data?.map(r => r.roles.name) ?? [];
   *
   *   // NextAuth
   *   const session = await getServerSession(authOptions);
   *   if (!session) redirect(APP_ROUTES.public.auth.signIn);
   *   const roles = session.user.roles ?? [];
   */
  // The template uses the mock account store as the single source of
  // truth for the logged-in user. Swap with `auth.getUser()` (or your
  // session lookup) when wiring real auth.
  const user = {
    id: currentAccount.id,
    email: currentAccount.email,
    name: currentAccount.name,
    avatarUrl: currentAccount.avatar_url,
  };
  const roles = ['admin' as const];

  return (
    <RolesProvider value={[...roles]}>
      <QueryProvider>
        <Dshb user={user}>{children}</Dshb>
      </QueryProvider>
    </RolesProvider>
  );
}
