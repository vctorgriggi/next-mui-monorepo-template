import { APP_ROUTES } from '@/constants/app-routes';

/**
 * Client-side RBAC mapping `route → required roles`.
 *
 * This file holds the *authorization* logic. Authentication itself
 * (proving who the user is) lives upstream — middleware, server layout,
 * or your auth provider. Here we just decide who sees what.
 *
 * The list of roles for the current user is provided by `RolesProvider`,
 * which you plug into your auth/data layer (Supabase, NextAuth, Firebase,
 * custom JWT). See `providers/RolesProvider.tsx`.
 *
 * Role labels and Chip colors are co-located here so any UI surface
 * (sidebar, user table, role select) renders roles consistently.
 */

export const ROLE_NAMES = ['admin', 'editor', 'viewer', 'user'] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

/** Human-readable role names. Used in selects, chips, table cells. */
export const ROLE_LABELS: Record<RoleName, string> = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
  user: 'User',
};

/** MUI Chip color per role. Keep in sync with ROLE_LABELS keys. */
export const ROLE_COLORS: Record<
  RoleName,
  'default' | 'primary' | 'success' | 'warning'
> = {
  admin: 'primary',
  editor: 'success',
  viewer: 'warning',
  user: 'default',
};

/**
 * Routes mapped to the roles that may access them. A user needs at least
 * one of the listed roles to pass. Routes NOT in this map are open to any
 * authenticated user (e.g. `/account`, `/about`).
 *
 * Match is via `startsWith` — registering `/users` also covers
 * `/users/[id]` and any deeper segment.
 */
export const ROUTE_PERMISSIONS: Record<string, RoleName[]> = {
  [APP_ROUTES.private.dashboard]: ['admin', 'editor', 'viewer'],
  [APP_ROUTES.private.users]: ['admin'],
};

/**
 * Returns true if any of the user's roles satisfy the route's permission
 * list. Unlisted routes are open to any authenticated user.
 */
export function hasAccess(pathname: string, roles: RoleName[]): boolean {
  const entry = Object.entries(ROUTE_PERMISSIONS).find(([route]) =>
    pathname.startsWith(route),
  );
  if (!entry) return true;
  const [, required] = entry;
  return required.some((role) => roles.includes(role));
}

/**
 * Where to send the user after sign-in or when they hit a forbidden
 * route. Falls back to `/account` (open to everyone).
 */
export function getDefaultRoute(roles: RoleName[]): string {
  if (
    roles.includes('admin') ||
    roles.includes('editor') ||
    roles.includes('viewer')
  ) {
    return APP_ROUTES.private.dashboard;
  }
  return APP_ROUTES.private.account;
}
