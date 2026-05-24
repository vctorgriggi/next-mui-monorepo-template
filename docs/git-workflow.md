# Git Workflow

How code moves from a feature branch to production. The template assumes a **GitHub** repo with **branch protections** and **GitHub Actions** running CI. Adapt to GitLab/Bitbucket as needed — the branch model and PR conventions stay the same.

> Every change enters via a feature branch + PR. Direct pushes to `develop`, `release`, and `main` should be blocked by branch protection rules. CI must be green before merge.

## Contents

- [Branch model](#branch-model)
- [Naming conventions](#naming-conventions)
- [Development flow](#development-flow)
- [Pull requests](#pull-requests)
- [CI](#ci)
- [Promoting to production](#promoting-to-production)
- [Hotfixes](#hotfixes)
- [Keeping branches aligned](#keeping-branches-aligned)
- [Never do this](#never-do-this)
- [Pre-PR checklist](#pre-pr-checklist)

---

## Branch model

| Branch    | Purpose                          | Deploy                       | Direct push | Base for features? |
| --------- | -------------------------------- | ---------------------------- | ----------- | ------------------ |
| `develop` | Active development integration   | Preview (Vercel)             | Blocked     | Yes                |
| `release` | Pre-production validation        | Preview (Vercel)             | Blocked     | No                 |
| `main`    | Production                       | Production (Vercel)          | Blocked     | No                 |

Flow:

```
feature/* → develop → release → main
```

- `develop` receives feature branches via PR.
- `release` receives merges from `develop` via PR — never directly from a feature branch.
- `main` receives merges from `release` via PR. Any merge to `main` triggers a production deploy.

Feature branches are **ephemeral** — delete after merge.

### Configure branch protection on GitHub

For each of `develop`, `release`, `main`:

1. **Settings → Branches → Add rule**
2. Branch name pattern: `develop` (then `release`, then `main`)
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging (select `Lint, test, type-check, build` from GitHub Actions)
   - ✅ Require branches to be up to date before merging
   - ✅ Do not allow bypassing the above settings
4. For `main` specifically, also enable:
   - ✅ Require linear history
   - ✅ Restrict who can push to matching branches (empty list = nobody, all changes via PR)

---

## Naming conventions

| Prefix      | Use case                                     | Example                            |
| ----------- | -------------------------------------------- | ---------------------------------- |
| `feature/`  | New feature                                  | `feature/users-bulk-import`        |
| `fix/`      | Bug fix                                      | `fix/dashboard-overflow`           |
| `chore/`    | Maintenance, no functional impact            | `chore/bump-mui`                   |
| `docs/`     | Docs-only changes                            | `docs/clarify-rbac-matrix`         |
| `refactor/` | Restructure without behavior changes         | `refactor/extract-auth-shell`      |

Format: `<prefix>/<short-kebab-case-description>`. Descriptive enough to identify the change without opening the PR.

### Commit messages

Adopt **conventional commits** (or any consistent scheme):

| Prefix      | Use case                                |
| ----------- | --------------------------------------- |
| `feat:`     | New feature                             |
| `fix:`      | Bug fix                                 |
| `refactor:` | Restructure, no behavior change         |
| `docs:`     | Docs only                               |
| `chore:`    | Maintenance (deps, configs)             |
| `test:`     | Adding or updating tests                |

---

## Development flow

```bash
# 1. Start from a fresh develop
git checkout develop
git pull origin develop

# 2. Branch
git checkout -b feature/your-feature

# 3. Code, commit
git add <files>
git commit -m "feat: describe what changed"

# 4. Push
git push origin feature/your-feature

# 5. Open the PR on GitHub (target: develop)
# 6. CI runs automatically. Vercel posts a preview link.
# 7. Review, address feedback, merge.
# 8. Delete the source branch (GitHub checkbox at merge time).
```

---

## Pull requests

A good PR has:

- **Clear title** — describes what, not how. "Add bulk-import flow to users page", not "changes to users".
- **Short description** — context for the reviewer. The diff speaks for itself; you provide the why.
- **Small scope** — one feature or fix per PR. Huge PRs slow down review.

### Required checks

Branch protection enforces:

- CI must be green (lint + test + type-check + build)
- Branch must be up to date with target
- (Optional) At least N approvals — configure based on team size

---

## CI

The template ships [`.github/workflows/ci.yml`](../.github/workflows/ci.yml). It runs four steps:

1. `pnpm install --frozen-lockfile`
2. `pnpm lint`
3. `pnpm test`
4. `pnpm type-check`
5. `pnpm build`

Runs on:

- Every PR to `develop`, `release`, `main`
- Every push to `develop`, `release`, `main` (post-merge verification)

If you don't want to spend CI minutes duplicating the build (Vercel rebuilds the same commit anyway), drop `pnpm build` from the workflow. For an open-source template it's worth keeping — it catches build issues without requiring contributors to run Vercel.

---

## Promoting to production

`develop → release → main` is a chain of PRs, each going through CI.

### develop → release

1. On GitHub: **Pull requests → New PR**, source `develop`, target `release`
2. Suggested title: `chore: promote develop → release`
3. Wait for CI green + Vercel preview
4. Validate on the preview link
5. Merge

If something needs fixing during validation, fix on `develop` (via a feature branch + PR) and open another `develop → release` PR.

### release → main

1. PR `release → main`
2. Wait for CI
3. Merge — Vercel kicks off the production deploy automatically

---

## Hotfixes

When something is broken in production and can't wait for the normal flow:

```bash
# 1. Branch from main
git checkout main
git pull origin main
git checkout -b fix/describe-the-hotfix

# 2. Minimal fix only — no refactoring on the side
git commit -m "fix: describe the hotfix"
git push origin fix/describe-the-hotfix

# 3. Open PR fix/* → main
# 4. CI green → merge → production deploys
# 5. Realign release and develop (see below)
```

---

## Keeping branches aligned

After any merge to `main` that didn't come through the normal `release → main` flow (i.e. a hotfix), realign the other branches:

1. PR `main → release` — merge after CI green
2. PR `main → develop` — merge after CI green

Without this, `develop` and `release` diverge from `main` and the next promotion generates avoidable conflicts.

**Never align in the opposite direction** (`develop → main` directly). That bypasses validation and can ship unreviewed code to production.

---

## Never do this

| Don't                                              | Why                                                         |
| -------------------------------------------------- | ----------------------------------------------------------- |
| Commit directly to `main`/`release`/`develop`      | Branch protection blocks it; every change needs a PR        |
| `git push --force` to a permanent branch           | Rewrites history. If unavoidable, force-with-lease and PR  |
| `git rebase` a published branch                    | Same — use merge                                            |
| Merge a feature branch directly into `release`     | `release` only receives from `develop`                      |
| Merge a feature branch directly into `main`        | `main` only receives from `release` (or hotfixes by exception) |
| `git add -A` without reviewing                     | Catches `.env.local`, build artifacts, sensitive files      |
| Keep a feature branch open for weeks               | Conflicts accumulate. Small branches, fast merges           |
| Merge with red CI                                  | Branch protection blocks it; if it doesn't, fix the rule    |

---

## Pre-PR checklist

Run locally what CI will run:

```bash
pnpm lint && pnpm type-check && pnpm test && pnpm build
```

- [ ] Tested manually (`pnpm dev`)
- [ ] `lint` clean
- [ ] `type-check` clean
- [ ] `test` clean
- [ ] `build` clean
- [ ] Commit messages descriptive
- [ ] Branch up to date with `develop` (rebase or merge)
- [ ] PR description explains the why
- [ ] Docs updated if conventions, architecture, or environment vars changed
