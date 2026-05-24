# Next.js MUI Monorepo Template 🚀

An opinionated starter for building MUI-based dashboards on Next.js 15. Ships with a feature-based architecture, typed server actions, React Query helpers, and a client-side RBAC scaffold — without locking you into any backend or auth provider.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MUI](https://img.shields.io/badge/MUI-6-007FFF?style=flat-square&logo=mui&logoColor=white)](https://mui.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Zod](https://img.shields.io/badge/Zod-3-3E67B1?style=flat-square&logo=zod&logoColor=white)](https://zod.dev/)
[![Turbo](https://img.shields.io/badge/Turborepo-2-EF4444?style=flat-square&logo=turborepo&logoColor=white)](https://turborepo.com/)

> This is **not** a minimal starter. It bundles patterns, conventions, and a deeply customized MUI theme that are worth keeping across projects.

---

## ✨ Features

🎨 **MUI dashboard shell** — Sidebar, navbar, dark/light/system mode, deeply customized theme
🧩 **Feature-based structure** — `actions.ts` / `hooks.ts` / `keys.ts` / `validators.ts` / `types.ts` per feature
⚡ **Server actions** with typed `Result<T>` returns — no thrown errors crossing the wire
🔁 **React Query helpers** — `fromResult` + `useOptionalQuery` + factory-built query keys
📋 **React Hook Form + Zod** — one schema validates the form, types the input, and feeds the server action
🔐 **Client-side RBAC** — `admin`/`editor`/`viewer`/`user` with a `RolesProvider` adapter; plug any auth backend in 10 lines
🎭 **Auth pages** — sign in, sign up, forgot password (Zod + RHF, no backend wired)
🧱 **Compound components** — `FilterCard`, `FormGrid` for filters and form layouts
📦 **Monorepo** — pnpm workspaces + Turborepo; shared `@template/ui`, `@template/shared`, `@template/config`
🚦 **GitHub Actions** — format + lint + test + type-check + build on every PR

---

## 🚀 Quick Start

```bash
# Clone
git clone <your-fork-url>
cd <your-folder>

# Enable pnpm (one-time, via corepack which ships with Node 20+)
corepack enable

# Install
pnpm install

# Run the app
pnpm --filter @template/web dev
# → http://localhost:3000
```

That's it. The template ships with **mocked data** so every page works out of the box. Sign-in/sign-up accept any input and drop you on the dashboard.

---

## 🏗️ Architectural Decisions

This template makes **strong, explicit choices**:

✅ **Feature-based folders** — every domain has the same six files in the same order. No `hooks/` or `services/` lint-bin folders.
✅ **`Result<T>` over throws** — server actions return `{ success, data } | { success, error }`. Errors are typed strings, not opaque exceptions.
✅ **React Query + RHF** — no Redux, no Context for server data. RHF for forms, React Query for the cache.
✅ **One Zod schema per form** — validation + types + error messages, one source of truth.
✅ **Backend-agnostic** — no Supabase, no NextAuth, no DB locked in. Auth/data adapters live in `RolesProvider`, the middleware, and feature `actions.ts` files — replace at will.
✅ **MUI Pro removed** — uses only Community packages; no license key required.

These decisions are intentional and documented.

---

## 📚 Documentation

The documentation is structured to be read progressively:

**Concepts & Architecture**
→ [`docs/conventions.md`](docs/conventions.md) — code style, feature structure, data layer, forms
→ [`docs/design-patterns.md`](docs/design-patterns.md) — visual system, layout shell, component bricks, flows
→ [`docs/access-control.md`](docs/access-control.md) — RBAC matrix and adapter examples
→ [`docs/tech-stack.md`](docs/tech-stack.md) — why each library is in the template, and what isn't

**Workflow & Operations**
→ [`docs/git-workflow.md`](docs/git-workflow.md) — branch model, commits, PRs, hotfixes
→ [`docs/environments.md`](docs/environments.md) — local, preview, production. Vercel + env var patterns

---

## 📂 Structure

```
apps/
  web/                              # The dashboard app — :3000
    app/
      (public)/                     # Auth pages (sign-in, sign-up, forgot-password)
      (private)/                    # Dashboard, users, account, about
    features/                       # Domain features (users, account) — mocked
    components/                     # ArrowBackLink, ClickableCard, layout/
    lib/auth/                       # RBAC permissions, hasAccess, getDefaultRoute
    lib/env/                        # Zod-validated env vars (client + server)
    layouts/Dshb.tsx                # Sidebar + header + main shell
    providers/                      # RolesProvider, QueryProvider, NotificationsProvider
    constants/app-routes.ts         # Single source of truth for route paths
    middleware.ts                   # No-op middleware (wire your auth here)

packages/
  ui/             # @template/ui             — MUI components + theme
  shared/         # @template/shared         — Result, query helpers, date, validators
  eslint-config/  # @template/eslint-config  — shared ESLint preset (base + Next)
  config/         # @template/config         — base tsconfigs

docs/             # Conventions, design system, access control, environments, git workflow
```

Each app imports shared code via `@template/ui`, `@template/shared`. Inside an app, use the `@/` alias (`@/features/users`, `@/lib/auth/permissions`, etc.).

---

## 🛠️ Tech Stack

**Framework** → [Next.js 15](https://nextjs.org/) (App Router + Turbopack)
**Monorepo** → [pnpm workspaces](https://pnpm.io/workspaces) + [Turborepo](https://turbo.build/)
**UI** → [MUI 6](https://mui.com/) (Community) + [MUI X](https://mui.com/x/) DataGrid / DatePickers
**Forms** → [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
**Data Fetching** → [TanStack Query v5](https://tanstack.com/query)
**Rich Text** → [TipTap](https://tiptap.dev/)
**Notifications** → [sonner](https://sonner.emilkowal.ski/)
**Dates** → [Day.js](https://day.js.org/)
**Language** → [TypeScript 5](https://www.typescriptlang.org/)
**Testing** → [Vitest](https://vitest.dev/)

See [`docs/tech-stack.md`](docs/tech-stack.md) for the why behind each choice.

---

## 📋 Commands

| Command                           | What it does                        |
| --------------------------------- | ----------------------------------- |
| `pnpm install`                    | Install workspace deps              |
| `pnpm --filter @template/web dev` | Run the app at `:3000`              |
| `pnpm dev`                        | Run every app in parallel           |
| `pnpm build`                      | Build all apps + packages           |
| `pnpm lint`                       | ESLint across every workspace       |
| `pnpm test`                       | Vitest in each workspace            |
| `pnpm type-check`                 | `tsc --noEmit` across the workspace |
| `pnpm format`                     | Prettier the whole repo             |
| `pnpm format:check`               | Verify formatting (CI gate)         |

---

## 🎯 When this template is a good fit

- You're building a **dashboard or backoffice app** with MUI.
- You want **opinions** about feature organization, error handling, and form validation — not a blank slate.
- You're **comfortable with TypeScript** and don't mind learning a few project-specific patterns.

## ⚠️ When it's NOT a good fit

- You want the smallest possible starter — try [`create-next-app`](https://nextjs.org/docs/getting-started/installation) instead.
- You're not using MUI — the theme and shell are deeply customized to it.
- You need a specific backend pre-wired (Supabase, Firebase) — fork and add it, but you'll fight some abstractions.

---

## 🤝 Contributing

Contributions are welcome! Open an issue or submit a PR.

---

## 📜 Project Status

This template is actively used and evolved. Breaking changes may happen as patterns improve.

---

## 📄 License

MIT. Use it however you want.

---

**[Issues](https://github.com/vctorgriggi/next-mui-monorepo-template/issues)**

Made with ❤️ by [vctorgriggi](https://github.com/vctorgriggi)
