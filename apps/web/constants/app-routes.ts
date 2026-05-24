/**
 * Single source of truth for route paths.
 *
 * Use these helpers everywhere — links, redirects, RBAC matrix — so that
 * renaming a route is a single-file change.
 */
export const APP_ROUTES = {
  private: {
    dashboard: '/dashboard',
    users: '/users',
    user: (id: string) => `/users/${id}`,
    account: '/account',
    about: '/about',
  },
  public: {
    home: '/',
    auth: {
      signIn: '/sign-in',
      signUp: '/sign-up',
    },
  },
} as const;

/**
 * Human-readable label per route. Consumed by the breadcrumb component
 * and by the sidebar to keep visuals consistent.
 *
 * Dynamic routes (e.g. `/users/[id]`) are not listed here — pages with
 * dynamic segments set their breadcrumb manually via `useBreadcrumbs`.
 */
export const ROUTE_LABELS: Record<string, string> = {
  [APP_ROUTES.private.dashboard]: 'Dashboard',
  [APP_ROUTES.private.users]: 'Users',
  [APP_ROUTES.private.account]: 'Account',
  [APP_ROUTES.private.about]: 'About',
};
