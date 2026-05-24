'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { getDefaultRoute, hasAccess } from '@/lib/auth/permissions';
import { useRoles } from '@/providers/RolesProvider';

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const roles = useRoles();
  const router = useRouter();

  const allowed = hasAccess(pathname, roles);

  useEffect(() => {
    if (!allowed) {
      router.replace(getDefaultRoute(roles));
    }
  }, [allowed, roles, router]);

  if (!allowed) return null;

  return <>{children}</>;
}
