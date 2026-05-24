# Access Control

This guide covers the access-control story in the template: which pages each role sees, how the frontend restricts navigation, and how to plug it into a real auth backend.

The template ships **client-side RBAC only**. Authentication (proving who the user is) is delegated to whatever provider you wire — Supabase, NextAuth, Auth0, Firebase, a custom JWT layer, etc. Authorization (deciding who sees what) lives in [`apps/web/lib/auth/permissions.ts`](../apps/web/lib/auth/permissions.ts) and the roles your auth code feeds into [`RolesProvider`](../apps/web/providers/RolesProvider.tsx).

> A real app should always have a server-side check too — middleware, server layout, or RLS on the database. Client-side RBAC alone is UX, not security. The template scaffolds the UX so the security layer can focus on enforcement.

## Contents

- [Roles](#roles)
- [Access matrix](#access-matrix)
- [How it's wired in the frontend](#how-its-wired-in-the-frontend)
- [Plugging real roles](#plugging-real-roles)
- [Adding a new route](#adding-a-new-route)
- [Adding a new role](#adding-a-new-role)

---

## Roles

The template ships four roles, defined in [`apps/web/lib/auth/permissions.ts`](../apps/web/lib/auth/permissions.ts):

| Role     | Purpose                                       | Default fallback route |
| -------- | --------------------------------------------- | ---------------------- |
| `admin`  | Full access — including user management       | `/dashboard`           |
| `editor` | Read + write content                          | `/dashboard`           |
| `viewer` | Read-only access to dashboards                | `/dashboard`           |
| `user`   | Bare-minimum role — only `/account`, `/about` | `/account`             |

Roles are **cumulative**: a user can have `editor` + `admin` simultaneously. `hasAccess` checks whether **at least one** of the user's roles satisfies the route.

The default `RolesProvider` value is `['admin']` so every page works out of the box without wiring auth. Change this in `app/(private)/layout.tsx` once you have a real auth backend.

---

## Access matrix

This is the source of truth. The map in `lib/auth/permissions.ts` implements exactly this table.

### Role-restricted pages

| Page        | Route         | `admin` | `editor` | `viewer` | `user` |
| ----------- | ------------- | ------- | -------- | -------- | ------ |
| Dashboard   | `/dashboard`  | ✓       | ✓        | ✓        |        |
| Users       | `/users`      | ✓       |          |          |        |
| User detail | `/users/[id]` | ✓       |          |          |        |

### Open pages (any authenticated user)

| Page    | Route      | Why                                  |
| ------- | ---------- | ------------------------------------ |
| Account | `/account` | Every user manages their own profile |
| About   | `/about`   | Public info about the app            |

Routes **not present** in `ROUTE_PERMISSIONS` are open to any authenticated user — you don't need to register every path, only the restricted ones.

### Navigation behavior

- **Sidebar:** only renders items the user can access. Entire sections disappear when the user has no items in them. A `user` sees only "About" + "Account"; an `editor` or `viewer` sees the same plus "Dashboard"; an `admin` sees everything.
- **Direct URL access:** if the user types a URL they can't access, `RouteGuard` redirects them to the first reachable route. No error page, no blank screen.
- **Fallback per role:** `admin`/`editor`/`viewer` → `/dashboard`; everyone else → `/account`. Defined in `getDefaultRoute`.

---

## How it's wired in the frontend

| File                                | Responsibility                                                                          |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| `lib/auth/permissions.ts`           | `ROUTE_PERMISSIONS`, `hasAccess()`, `getDefaultRoute()`, `ROLE_LABELS`, `ROLE_COLORS`   |
| `providers/RolesProvider.tsx`       | React Context that exposes the current user's roles                                     |
| `app/(private)/layout.tsx`          | Server component — fetches the user, fetches roles, wraps the tree with `RolesProvider` |
| `components/layout/MenuContent.tsx` | Filters sidebar sections and items via `hasAccess()`                                    |
| `components/layout/RouteGuard.tsx`  | Client guard — redirects when the URL is forbidden                                      |
| `layouts/Dshb.tsx`                  | Wraps `children` with `RouteGuard`                                                      |

### Check flow

```
User hits /users
  │
  └─► (private)/layout.tsx (server)
        ├─► (your auth) — verify session, fetch roles
        └─► <RolesProvider value={roles}> wraps the tree
              │
              └─► RouteGuard (client)
                    ├─► hasAccess('/users', roles)
                    │     ├─► admin       → render the page
                    │     └─► editor/etc. → redirect to fallback
                    └─► MenuContent filters visible items
```

---

## Plugging real roles

In `app/(private)/layout.tsx` you'll find:

```tsx
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
```

Replace with the shape your auth provider returns. Examples:

**Supabase:**

```ts
const supabase = await createServerClient();
const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) redirect(APP_ROUTES.public.auth.signIn);

const { data } = await supabase
  .from('user_roles')
  .select('roles(name)')
  .eq('user_id', user.id);
const roles = data?.map((r) => r.roles.name) ?? [];
```

**NextAuth (Auth.js):**

```ts
const session = await getServerSession(authOptions);
if (!session) redirect(APP_ROUTES.public.auth.signIn);
const roles = session.user.roles ?? [];
```

**Custom JWT:**

```ts
const token = (await cookies()).get('token')?.value;
if (!token) redirect(APP_ROUTES.public.auth.signIn);
const roles = decodeJwt(token).roles ?? [];
```

The downstream guard (`RouteGuard`) and sidebar filter don't care which provider produced the roles — they only consume the array.

---

## Adding a new route

1. **Register the path** in `constants/app-routes.ts` (`APP_ROUTES`) and add a label in `ROUTE_LABELS`.
2. **Decide who can access**. If everyone, do nothing — the route is open by default. If restricted, add it to `ROUTE_PERMISSIONS`:

   ```ts
   [APP_ROUTES.private.reports]: ['admin', 'editor'],
   ```

3. **Add to the sidebar** in `MenuContent.tsx`. Role filtering happens automatically via `hasAccess()`.
4. **Update [the matrix above](#access-matrix)** in this doc.

If the page calls a server action that hits an external API (no DB RLS to back it up), repeat the role check **in the action** — client-side RBAC is for UX, not security.

---

## Adding a new role

1. **Add the role name** to `ROLE_NAMES` in `lib/auth/permissions.ts`:

   ```ts
   export const ROLE_NAMES = [
     'admin',
     'editor',
     'viewer',
     'user',
     'auditor',
   ] as const;
   ```

2. **Add label + color** to `ROLE_LABELS` and `ROLE_COLORS` (same file).
3. **Wire into routes** by adding the role to the relevant entries in `ROUTE_PERMISSIONS`.
4. **Add a fallback** in `getDefaultRoute` if the new role needs a custom landing page.
5. **Update the auth adapter** in `(private)/layout.tsx` to actually return the new role from your backend.
6. **Update [the matrix above](#access-matrix)** in this doc.

Roles ship with the same shape end-to-end (`RoleName` type, `USER_ROLES` enum re-exported in `features/users/validators.ts`), so adding one is a single-spot change.
