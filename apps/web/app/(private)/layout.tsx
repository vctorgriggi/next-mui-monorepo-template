import type { Metadata } from 'next';

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
  const user = {
    id: 'mock-user-id',
    email: 'demo@example.com',
    name: 'Demo User',
    avatarUrl: null,
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
