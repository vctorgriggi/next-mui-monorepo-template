# Tech Stack

Why each piece of the stack is in the template, how it's used, and where the limits are. Open this when picking a library to extend the template, or when wondering whether to swap one out.

## Contents

- [Next.js 15 (App Router)](#nextjs-15-app-router)
- [TypeScript 5](#typescript-5)
- [MUI 6](#mui-6)
- [React Hook Form + Zod](#react-hook-form--zod)
- [TanStack Query](#tanstack-query)
- [TipTap](#tiptap)
- [sonner](#sonner)
- [Day.js](#dayjs)
- [Turborepo + pnpm](#turborepo--pnpm)
- [Vitest](#vitest)
- [Tailwind CSS](#tailwind-css)
- [What's intentionally NOT here](#whats-intentionally-not-here)

---

## Next.js 15 (App Router)

### What

Full-stack React framework. The App Router (stable since Next.js 13) gives you server components by default, server actions as the API layer, and directory-based routing.

### Why

| Factor                 | Reason                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| Full-stack in one repo | Server actions remove the need for a separate backend layer in many apps. Co-locate or split — your choice. |
| Server components      | Heavy pages don't ship the form library or validators to the browser. Smaller bundles, faster first paint.  |
| Declarative routing    | `(public)` and `(private)` groups separate auth-gated and open routes without manual middleware juggling.   |
| Ecosystem              | Native Vercel deploy, Turbopack in dev, first-class TypeScript, and tight integration with React Query SSR. |

### How the template uses it

- `app/(public)/` — auth pages, marketing, anything pre-login
- `app/(private)/` — gated dashboard surfaces, wrapped in the shell
- `app/(private)/layout.tsx` — server component fetches user + roles and wraps the tree with `RolesProvider`
- `app/api/...` — empty by default; add route handlers when you need them
- `middleware.ts` — no-op; wire your auth provider's session refresh here

Server actions return `Result<T>` (see [`conventions.md`](conventions.md)) so client code never gets opaque "An error occurred" strings.

### Limits

- Server actions aren't REST. No stable URL means no external webhooks calling them — for that, add route handlers under `app/api/`.
- App Router still ships meaningful changes between major versions. The 14 → 15 jump made `params` a Promise in pages — keep `next` upgrades on the radar.

---

## TypeScript 5

The template is **strict** TypeScript everywhere. No `any`, no `// @ts-ignore`, no untyped imports.

`packages/config` ships a `tsconfig.base.json` and `tsconfig.next.json` that every app and package extends. Centralizes `target`, `module`, `strict`, `paths` — adjust once, everyone follows.

---

## MUI 6

### What

Material UI v6 — a comprehensive component library based on Material Design. The template uses **Community packages only**; no Pro license required.

### Why

| Factor             | Reason                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| Productivity       | Pre-built components (DataGrid, DatePicker, etc.) save weeks of work.                              |
| Consistent surface | Buttons, inputs, cards, tables all share design tokens. No "looks like five apps" feel.            |
| Theme system       | One file (`themePrimitives.ts`) drives the whole palette. Dark mode is a token switch, not a fork. |
| Long-term support  | Active maintenance, big ecosystem of recipes and Stack Overflow answers.                           |

### How the template uses it

- Theme + customizations in [`packages/ui/src/theme/`](../packages/ui/src/theme/)
- Component wrappers in [`packages/ui/src/components/`](../packages/ui/src/components/) — `CustomTextField`, `ConfirmDialog`, `StatCard`, `FormGrid`, `FilterCard`, etc.
- DataGrid via `@mui/x-data-grid` (Community), with `DATA_GRID_DEFAULTS` centralizing pagination, slot props, and row striping
- Date pickers via `@mui/x-date-pickers` (Community)

### Why no `@mui/x-data-grid-pro`

The Pro packages need a paid license and show watermarks without one. The Community version covers 95% of common dashboard needs. If you need Pro features (column pinning, row grouping, etc.), add the package and configure the license key in your `AppTheme`.

### Limits

- **Bundle size** — MUI is one of the larger component libraries. Tree-shaking helps but the impact is real. Worth monitoring as your app grows.
- **`'use client'` everywhere** — MUI components are client-side. Pages that render mostly MUI shouldn't bother going server-first.

---

## React Hook Form + Zod

### What

**React Hook Form** owns form state and validation timing. **Zod** describes the shape of the data + the validation rules. The `@hookform/resolvers/zod` resolver glues them.

### Why one schema, three jobs

A Zod schema gives you:

1. **Validation** — the resolver runs it on submit/blur/change
2. **Types** — `type UserValues = z.infer<typeof userSchema>` keeps form values and server action params in sync
3. **Error messages** — defined once on the schema, displayed via `errors.field?.message`

No drift between client and server. The same schema validates in the server action via `validateInput(schema, data)`.

### How

```ts
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  role: z.enum(USER_ROLES),
});

type UserValues = z.infer<typeof userSchema>;
```

The pattern is documented in [`conventions.md`](conventions.md#forms).

### Limits

- RHF's mental model (`register`, `Controller`, `useFormContext`) takes a few hours to internalize. Worth it long-term.
- Zod v4 is on the horizon. The template is on v3; migration is mostly mechanical when v4 stabilizes.

---

## TanStack Query

### What

Server-state cache for React. The template uses v5.

### Why

- No Redux, no Context for server data. The cache **is** the state.
- Surgical invalidation — `invalidateQueries({ queryKey: userKeys.lists() })` refetches only what changed.
- Loading / error / refetch / pagination / suspense — all primitives are there.

### How

Two helpers eat the boilerplate:

- **`fromResult(fn)`** — turns a `Result`-returning server action into a `queryFn`/`mutationFn` that throws on failure (what RQ expects).
- **`useOptionalQuery(id, keyFn, queryFn)`** — wraps the `enabled: !!id` + conditional `queryKey` + `fromResult` pattern.

Query keys come from `createQueryKeys('<domain>')` — same factory shape per feature, no key drift.

### Cache strategy

| Constant              | Value      | Use case                                                            |
| --------------------- | ---------- | ------------------------------------------------------------------- |
| `CACHE_STALE_SECONDS` | 300 (5min) | Default `staleTime` for React Query, matches `unstable_cache` value |
| `CACHE_LONG_SECONDS`  | 3600 (1h)  | Slow upstreams; combine with `revalidateTag` for refresh paths      |

### Limits

- Pull-based. No real-time. If two users edit the same record, neither sees the other's change until refetch. Combine with WebSockets or Supabase Realtime if you need it.
- Memory cache only — page reloads lose it (mitigated by SSR hydration on initial paint, if you wire it).

---

## TipTap

Headless rich-text editor (built on ProseMirror). The template includes:

- `RichTextEditor` — TipTap-powered with a small toolbar (bold/italic/strike/headings/lists/blockquote/code/link). Outputs sanitized HTML.
- `RichTextView` — read-only renderer that runs the same sanitizer on display.

HTML is sanitized via [`@template/shared/sanitize`](../packages/shared/src/sanitize.ts) — uses `sanitize-html` (pure JS, works on server and client) instead of `isomorphic-dompurify` (which pulls a heavy `jsdom` dependency that breaks some CJS bundles).

Use it only when you need actual rich text (changelog entries, comments, descriptions). For plain text, stick with `CustomTextField multiline`.

---

## sonner

Toast notifications. Wrappers in [`@template/ui/notifications`](../packages/ui/src/notifications.ts) — `notifySuccess`, `notifyError`, `notifyInfo`, `notifyWarning`. The `<Toaster />` is mounted once in the root layout via `NotificationsProvider`.

Chosen over react-toastify and other alternatives for its small footprint and clean Sonner-style stacked-toast animations.

---

## Day.js

Lightweight date library (2KB) used by `@template/shared/date`. Formatters there return ISO-friendly strings (`"15 Mar 2026"`, `"15 Mar 2026 at 14:30"`, `"2 days ago"`).

Day.js's plugin model keeps the bundle small — only `relativeTime` is loaded.

---

## Turborepo + pnpm

### What

`pnpm workspaces` resolves the monorepo, `Turborepo` orchestrates the task graph (build, lint, test, type-check) with caching.

### Why

- One install, all packages linked.
- `pnpm --filter @template/web dev` runs just one app.
- `pnpm build` builds everything in the right order with Turbo cache hits when unchanged.

### Limits

- Turbo cache misses can be confusing — `pnpm turbo run build --force` clears them.
- pnpm's strict-by-default install can surprise people coming from npm/yarn. The `.npmrc` has `legacy-peer-deps=true` for the MUI ecosystem.

---

## Vitest

Test runner. Faster than Jest, ESM-first, compatible with Jest's API. Tests live next to source files (`format.test.ts` next to `format.ts`).

Currently used by `@template/shared` — extend to apps as you add real logic worth testing.

---

## Tailwind CSS

Used **sparingly** — only for layout primitives in `globals.css` and ad-hoc atomic classes when MUI would be heavy-handed.

For component-level styling, always use MUI's `sx` prop. Mixing Tailwind and `sx` on the same component leads to specificity wars.

---

## What's intentionally NOT here

The template avoids decisions that should belong to your specific project. Each is a one-package install when you need it.

| What                     | Why it's out                                                                           |
| ------------------------ | -------------------------------------------------------------------------------------- |
| **Database / ORM**       | Add Drizzle / Prisma / Kysely when you know your DB. No default punishes a wrong fit.  |
| **Auth provider**        | `RolesProvider` is the seam. Plug Supabase / NextAuth / Auth0 / custom JWT.            |
| **Email provider**       | Resend / Postmark / SES — pick when you need it.                                       |
| **Analytics**            | PostHog / Plausible / GA4 — depends on privacy posture.                                |
| **Feature flags**        | GrowthBook / LaunchDarkly / Unleash — depends on scale.                                |
| **Error monitoring**     | Sentry / Datadog / etc. — the `app/error.tsx` boundary has the `// log here` hook.     |
| **Internationalization** | next-intl / next-translate — only worth setting up if you actually have >1 locale.     |
| **State management**     | React Query + RHF cover ~95% of use cases. Add Zustand / Jotai only if you hit a wall. |

Each of these is a 10-minute integration. Adding all of them upfront is a 10-hour cleanup later.
