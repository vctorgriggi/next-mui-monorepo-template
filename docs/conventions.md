# Code Conventions

This guide covers how code is organized and written in this template. Read it before adding a feature, a page, or a shared utility — the structure is opinionated, and following it keeps the codebase legible as it grows.

The template is a **Next.js 15 (App Router) + React 19 + MUI 6** app, organized as a pnpm + Turborepo monorepo. Code is in English; comments and JSDoc are in English; UI strings are in English. If you fork it for a Portuguese-language product, the UI strings are the only thing you need to swap.

## Contents

- [Architectural decisions](#architectural-decisions)
- [Monorepo structure](#monorepo-structure)
- [Imports](#imports)
- [Feature structure](#feature-structure)
- [Data layer](#data-layer)
- [Forms](#forms)
- [Components, UI, navigation](#components-ui-navigation)
- [Utilities](#utilities)

---

## Architectural decisions

These are intentional, codebase-wide choices.

| Decision         | Choice                            | Why                                                                                                   |
| ---------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Organization     | Feature-based                     | Each domain owns its `actions`/`hooks`/`keys`/`validators`/`types`. No `hooks/` lint-bin folders.     |
| Server actions   | `Result<T>` over `throw`          | Exceptions in server actions arrive on the client as generic errors. `Result` keeps the message.     |
| Query helpers    | `fromResult` + `useOptionalQuery` | Eliminates the unwrap-Result + enabled + queryKey boilerplate that repeats in every hook.            |
| State management | React Query + React Hook Form     | No Redux, no Context for server data. RQ owns the cache, RHF owns forms. Global client state ≈ 0.   |
| Validation       | Zod schemas                       | One schema validates the form (`zodResolver`), types the input (`z.infer`), and supplies messages.   |
| Auth / data      | Adapter, not built-in             | `RolesProvider`, `middleware.ts`, and feature `actions.ts` are the seams. Plug any backend.          |
| Styling          | MUI `sx` + Tailwind for layout    | `sx` for MUI components (respects theme tokens). Tailwind only in `globals.css` and raw HTML.        |
| Text inputs      | `CustomTextField` wrapper         | Centralizes a11y and visual tweaks. Reaching for raw `TextField` skips them.                         |
| Icons            | `Rounded` suffix                  | `HomeRoundedIcon`, not `HomeIcon`. Mixing icon families breaks visual consistency.                   |
| Nullish fallback | `??`, never `\|\|`                | `\|\|` swallows valid `0`, `""`, `false`. `??` only acts on `null`/`undefined`.                      |

---

## Monorepo structure

```
apps/
  web/        # The dashboard app — :3000
packages/
  ui/         # @template/ui     — MUI components + theme
  shared/     # @template/shared — Result, query helpers, format/date/tree
  config/     # @template/config — base tsconfigs
```

### Where new code goes

| Code type                              | Lives in                       | Example                                     |
| -------------------------------------- | ------------------------------ | ------------------------------------------- |
| Domain logic (users, billing, etc.)    | `apps/web/features/<domain>/`  | `apps/web/features/users/actions.ts`        |
| Reusable UI component (no domain)      | `packages/ui/src/components/`  | `StatCard`, `ConfirmDialog`, `FilterCard`   |
| MUI theme tweaks                       | `packages/ui/src/theme/`       | `AppTheme`, `customizations/dataGrid.ts`    |
| Pure utility (format, date, tree)      | `packages/shared/src/`         | `format.ts`, `date.ts`, `tree.ts`           |
| App-specific helper (env, auth, integ) | `apps/web/lib/`                | `apps/web/lib/auth/permissions.ts`          |

**Rule of thumb:** if more than one app would import it, push it to `packages/`. Otherwise it belongs to the app.

### Adding a dependency

```bash
# To a specific app:
pnpm --filter @template/web add <pkg>

# To a package:
pnpm --filter @template/ui add <pkg>

# Dev-only at the root (Turbo, Prettier):
pnpm add -Dw <pkg>
```

---

## Imports

Inside an app, use the `@/...` alias (defined in `tsconfig.json` as `"@/*": ["./*"]`):

```ts
import { fetchUsers } from '@/features/users';
import { APP_ROUTES } from '@/constants/app-routes';
import { hasAccess } from '@/lib/auth/permissions';
```

For shared code, import from `@template/*`:

```ts
import { formatDate } from '@template/shared/date';
import { fromResult } from '@template/shared/result';
import type { Result } from '@template/shared/result';
import CustomTextField from '@template/ui/CustomTextField';
import { FormGrid } from '@template/ui/FormGrid';
import { notifySuccess } from '@template/ui/notifications';
```

Apps must **never** import from each other (`apps/web/...` ↔ `apps/other/...`). Extract to a package instead.

---

## Feature structure

Every domain feature lives in `apps/web/features/<domain>/` with the same six files:

```
apps/web/features/<domain>/
  ├── actions.ts       # Server actions ('use server') → Result<T>
  ├── hooks.ts         # React Query hooks ('use client')
  ├── keys.ts          # Query key factory via createQueryKeys()
  ├── validators.ts    # Zod schemas + enums + label/color maps
  ├── types.ts         # Interfaces when the domain has complex types
  └── index.ts         # Public exports — what the feature exposes
```

**Rules:**

- `actions.ts` is always `'use server'`. `hooks.ts` is always `'use client'`. Never mix — that separation is what lets Next.js split bundles.
- `index.ts` is the public API. Pages and other features import from `@/features/<domain>` (the barrel), never directly from `actions.ts` or `hooks.ts`.
- `types.ts` is optional — if the domain only has a `z.infer<typeof schema>` you don't need it.
- Mock data (for template purposes) lives in a `data.ts` co-located with the feature; replace with real DB / API calls later.

See [`apps/web/features/users/`](../apps/web/features/users/) for the canonical reference.

---

## Data layer

### `Result<T>`

Every server action returns `Result<T>` — never throws. Exceptions in Next.js server actions get serialized as opaque errors on the client; `Result<T>` keeps the message readable and the type narrow.

```ts
// packages/shared/src/result.ts
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

Use `success(data)` and `failure(message)` to build them:

```ts
// apps/web/features/users/actions.ts
'use server';
export async function fetchUserById(id: string): Promise<Result<User>> {
  const invalid = validateInput(idSchema, id);
  if (invalid) return invalid;       // already a Result<never>
  const user = usersStore.get(id);
  if (!user) return failure('User not found');
  return success(user);
}
```

### Validating input

Server actions are reachable from devtools. Client-side validation is UX, not a security barrier. Validate **before** touching the data layer:

```ts
import { validateInput, uuidSchema } from '@template/shared/validators';
import { userSchema } from './validators';

const invalid = validateInput(userSchema, input);
if (invalid) return invalid;
```

`validateInput` returns `undefined` on success and a typed `Result<never>` on failure — paste-and-return directly.

### Query hooks

Two helpers eat the boilerplate that otherwise repeats in every hook: `fromResult` and `useOptionalQuery`.

**`fromResult(fn)`** turns a `Result`-returning action into a `queryFn` that throws on failure (what React Query expects):

```ts
// Without:
queryFn: async () => {
  const result = await fetchUsers();
  if (!result.success) throw new Error(result.error);
  return result.data;
},

// With:
queryFn: fromResult(fetchUsers),
```

**`useOptionalQuery(id, keyFn, queryFn)`** wraps the `enabled: !!id` + conditional `queryKey` + `fromResult` pattern for queries that depend on a nullable ID:

```ts
// Without:
export function useUser(id: string | null) {
  return useQuery({
    queryKey: id ? userKeys.detail(id) : [],
    enabled: !!id,
    queryFn: async () => {
      const r = await fetchUserById(id!);
      if (!r.success) throw new Error(r.error);
      return r.data;
    },
  });
}

// With:
export function useUser(id: string | null) {
  return useOptionalQuery(id, userKeys.detail, fetchUserById);
}
```

Mutations use `fromResult` too:

```ts
mutationFn: (vars: { id: string; input: UserValues }) =>
  fromResult(() => updateUser(vars.id, vars.input))(),
```

### Query keys

Cache keys come from `createQueryKeys('<domain>')`. Hand-rolled arrays drift — the factory keeps the writer and the invalidator in sync:

```ts
// Simple — gives you .all, .lists(), .detail(id)
export const userKeys = createQueryKeys('users');

// Extended — spread the base, add domain branches
const base = createQueryKeys('campaigns');
export const campaignKeys = {
  ...base,
  snapshots: (id: string) =>
    [...base.all, 'detail', id, 'snapshots'] as const,
};
```

### Cache strategy

| Constant              | Value      | When to use                                                                                       |
| --------------------- | ---------- | ------------------------------------------------------------------------------------------------- |
| `CACHE_STALE_SECONDS` | 300 (5min) | Default. Matches React Query's `staleTime` in `providers/query-client.tsx`.                       |
| `CACHE_LONG_SECONDS`  | 3600 (1h)  | Pairs with `unstable_cache` for slow upstream calls. Combine with a `revalidateTag` refresh path. |

**Don't redeclare `staleTime` in hooks unless it differs from the default.** The shared client already sets 5 minutes; setting it again is noise.

---

## Forms

Every form is **React Hook Form + Zod resolver**, with one schema doing triple duty (validation, types, messages):

```ts
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  role: z.enum(USER_ROLES),
});

type UserValues = z.infer<typeof userSchema>;
```

Inputs follow `FormControl + FormLabel + CustomTextField`:

```tsx
<FormControl>
  <FormLabel htmlFor="email">Email</FormLabel>
  <CustomTextField
    {...register('email')}
    id="email"
    type="email"
    error={!!errors.email}
    helperText={errors.email?.message}
  />
</FormControl>
```

**Never** use `TextField`'s inline `label` prop — `FormLabel` keeps caption typography and helperText layout consistent.

For non-input MUI components (Autocomplete, DatePicker, custom), use `Controller`:

```tsx
<Controller
  name="role"
  control={control}
  render={({ field }) => <CustomAutocomplete {...field} options={...} />}
/>
```

The dialog pattern (`UserDialog.tsx`): `isSubmitting` drives the loading state on the primary button; the form is `disabled={isEditing && !isDirty}` so the save button only lights up when something changed.

---

## Components, UI, navigation

The visual rulebook lives in [`design-patterns.md`](design-patterns.md) — palette, spacing, page anatomy, component-by-component recipes. Open it before building a page or a dialog.

---

## Utilities

### Result

`packages/shared/src/result.ts` — `success`, `failure`, `fromResult`. Discussed above.

### Validators

`packages/shared/src/validators.ts`:
- `uuidSchema` — `z.string().uuid('Invalid ID')`. Use when an ID column is a real UUID.
- `validateInput(schema, data)` — runs `safeParse`, returns `Result<never>` on failure, `undefined` on success.

### Format & date

| Helper                       | Output                       |
| ---------------------------- | ---------------------------- |
| `formatNumber(1500)`         | `"1.5K"`                     |
| `formatNumber(1_500_000)`    | `"1.5M"`                     |
| `formatDate(iso)`            | `"15 Mar 2026"`              |
| `formatDateTime(iso)`        | `"15 Mar 2026 at 14:30"`     |
| `formatRelative(iso)`        | `"2 days ago"` / `"in 3 days"` |
| `formatDateWithRelative(iso)`| `"15 Mar 2026 (2 days ago)"` |

### Tree

`packages/shared/src/tree.ts` — for hierarchical structures (file trees, nav menus, etc.):

| Function                  | When to use                              | Input format                           |
| ------------------------- | ---------------------------------------- | -------------------------------------- |
| `buildTreeFromPaths`      | Items with `/`-separated paths           | `{ path: 'A/B/C' }`                    |
| `buildTreeFromParentPath` | Items that already know their parent     | `{ path, parent_path }`                |
| `filterRelevantNodes`     | Filter, keep ancestors of matching items | Items with `parent_path` for chain-up  |

`filterRelevantNodes` walks the `parent_path` chain (not a path split) so titles containing `/` (e.g. `"Banking/Operations"`) don't accidentally break the hierarchy.
