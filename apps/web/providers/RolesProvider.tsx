'use client';

import { createContext, type ReactNode, useContext } from 'react';

import type { RoleName } from '@/lib/auth/permissions';

/**
 * Provides the current user's roles to client components.
 *
 * This template ships with a mock default (`['admin']`) so every page
 * renders out of the box. To wire real roles:
 *
 * 1. Fetch the user + their roles in `app/(private)/layout.tsx`
 *    (server component) using your auth/data layer.
 * 2. Pass them as `<RolesProvider value={roles}>` around the tree.
 *
 * Adapter sketches:
 *
 *   // Supabase
 *   const { data: { user } } = await supabase.auth.getUser();
 *   const { data } = await supabase
 *     .from('user_roles')
 *     .select('roles(name)')
 *     .eq('user_id', user.id);
 *   const roles = data?.map((r) => r.roles.name) ?? [];
 *
 *   // NextAuth
 *   const session = await getServerSession(authOptions);
 *   const roles = session?.user?.roles ?? [];
 *
 *   // Custom JWT
 *   const token = (await cookies()).get('token')?.value;
 *   const roles = token ? decodeJwt(token).roles : [];
 */
const RolesContext = createContext<RoleName[]>(['admin']);

interface RolesProviderProps {
  value: RoleName[];
  children: ReactNode;
}

export function RolesProvider({ value, children }: RolesProviderProps) {
  return (
    <RolesContext.Provider value={value}>{children}</RolesContext.Provider>
  );
}

export function useRoles(): RoleName[] {
  return useContext(RolesContext);
}
