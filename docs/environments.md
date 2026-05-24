# Environments & Deploy

This guide covers the local, preview, and production environments and the workflow that promotes code between them. The template ships **deploy-agnostic**, but the assumed setup is **Vercel for hosting** + **GitHub Actions for CI**.

## Contents

- [Overview](#overview)
- [Local development](#local-development)
- [Preview deploys](#preview-deploys)
- [Production](#production)
- [Workflow](#workflow)
- [Environment variables](#environment-variables)
- [Commands reference](#commands-reference)
- [Security & rollback](#security--rollback)

---

## Overview

| Environment | Where it runs        | Data             | Deploy                          |
| ----------- | -------------------- | ---------------- | ------------------------------- |
| Local       | `localhost:3000`     | Seed / mock      | Manual (`pnpm dev`)             |
| Preview     | Vercel (per branch)  | Test / seed      | Automatic on every branch push  |
| Production  | Vercel               | Real             | Automatic on merge to `main`    |

Local + preview should share a non-production data source (mocked, a dev DB, a sandbox tenant). Production has its own credentials and is the only environment touching real user data.

---

## Local development

### Setup (once per machine)

```bash
# Clone the repo
git clone <your-fork-url>
cd <your-folder>

# Enable pnpm via corepack (ships with Node 20+)
corepack enable

# Install everything in the workspace
pnpm install
```

> The repo has `legacy-peer-deps=true` in `.npmrc` — required by MUI's peer-deps story. Don't remove it.

### Configure env vars

Each app declares its own env file. For the dashboard:

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

The template ships with an empty schema — no env vars are required to run. Add yours to [`apps/web/lib/env/client.ts`](../apps/web/lib/env/client.ts) (browser-visible, prefixed `NEXT_PUBLIC_`) and [`apps/web/lib/env/server.ts`](../apps/web/lib/env/server.ts) (server-only). Zod parses on boot — missing vars crash fast with a clear error.

### Run

```bash
# Just the dashboard
pnpm --filter @template/web dev

# All apps in parallel (only meaningful if you add more apps)
pnpm dev
```

Open `http://localhost:3000`. Sign-in/sign-up are wired but auth is fake — any valid input lands you on the dashboard.

---

## Preview deploys

Every branch pushed to your remote spawns an automatic Vercel preview deploy. Use it for code review with visual context, manual testing, and stakeholder sign-off before merging.

### Configure on Vercel

1. **Import the repo** on Vercel and let it detect Next.js automatically.
2. **Set the root directory** to `apps/web` (Vercel will offer this if your repo is a monorepo).
3. **Set the install command** to `pnpm install --frozen-lockfile`.
4. **Set the build command** to `pnpm --filter @template/web build` (Vercel infers this in most cases).
5. **Add env vars** in Project Settings → Environment Variables. Mark each as `Preview` and `Production` as appropriate.

> Never use production credentials in Preview. A bug on a preview branch hitting prod data is a real incident.

---

## Production

### Configure on Vercel

Same as preview, but env vars marked `Production`. Add the production domain (e.g. `app.example.com`) in **Project Settings → Domains**.

If you wire OAuth, add the production callback URL in your provider's allow-list (e.g. for Google OAuth: `https://app.example.com/auth/callback`).

---

## Workflow

### Branches

- `main` — production. Branch restrictions enforce CI green + PR review.
- `develop` — integration. Feature branches merge here first.
- `release` — pre-prod validation. `develop → release → main` is the promotion chain.
- `feature/*`, `fix/*` — ephemeral. Branch from `develop`, merge back via PR, delete after merge.

Details and PR conventions in [`git-workflow.md`](git-workflow.md).

### Feature lifecycle

```
1. git checkout -b feature/my-feature   (from develop)
2. code, commit, push
3. Vercel auto-generates a preview URL
4. Open a PR to develop
5. CI runs (lint + test + type-check + build)
6. Review + approve + merge
7. Promote develop → release → main via PRs
8. Vercel auto-deploys main to production
```

### Pre-PR checklist

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

CI runs the same four commands. If they pass locally, the PR will pass CI.

---

## Environment variables

The template declares **no env vars** out of the box. Add yours as you wire features.

### Pattern

Variables live in two Zod schemas:

**`apps/web/lib/env/client.ts`** — browser-visible (must be prefixed `NEXT_PUBLIC_`):

```ts
export const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
});

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
```

> Every `process.env.NEXT_PUBLIC_*` access must be a literal reference so the Next.js bundler can inline the value at build time. Don't index the object dynamically.

**`apps/web/lib/env/server.ts`** — server-only (no `NEXT_PUBLIC_` prefix):

```ts
import 'server-only';
import { clientSchema } from './client';

const schema = clientSchema.extend({
  DATABASE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().min(1),
});

export const serverEnv = schema.parse(process.env);
```

### Where to read

| Where             | Use                       |
| ----------------- | ------------------------- |
| Browser code      | `import { clientEnv }`    |
| Server actions    | `import { serverEnv }`    |
| Server components | Either, depending on need |

The `import 'server-only'` in `server.ts` makes Next.js fail the build if you accidentally import it from a client component — better than a runtime leak.

### Updating `turbo.json`

When you add a new env var, list it in `turbo.json`'s `tasks.build.env` array. Turborepo uses this to invalidate the cache when env values change.

---

## Commands reference

| Action                | Command                                |
| --------------------- | -------------------------------------- |
| Install deps          | `pnpm install`                         |
| Dev (single app)      | `pnpm --filter @template/web dev`      |
| Dev (all apps)        | `pnpm dev`                             |
| Lint                  | `pnpm lint`                            |
| Format                | `pnpm format`                          |
| Type-check            | `pnpm type-check`                      |
| Test                  | `pnpm test`                            |
| Build                 | `pnpm build`                           |
| Serve local build     | `pnpm --filter @template/web start`    |

---

## Security & rollback

### Secrets

| Rule                                       | Why                                                                  |
| ------------------------------------------ | -------------------------------------------------------------------- |
| Never commit `.env.local`                  | Already gitignored, but `git add -A` can sneak it in                 |
| `NEXT_PUBLIC_*` is public by design        | Anything with this prefix ends up in the browser bundle              |
| Never alias a secret with `NEXT_PUBLIC_`   | The bundler will happily inline it                                   |
| Production secrets live on Vercel only    | Never put them in the repo, never share via chat                     |

### Rollback (Vercel)

Vercel keeps deployment history. To revert:

1. **Vercel Dashboard → Deployments**
2. Find the last stable deploy
3. Three-dots → **Promote to Production**

Instant — no rebuild, just traffic switch.

Via the Vercel CLI:

```bash
vercel rollback
```
