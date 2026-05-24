# Design Patterns

Visual system and UX flows. Cover palette, typography, spacing, layout, the component library, and the canonical screen anatomies. Read before designing a new page, dialog, or card — the goal is that every screen obeys the same contract.

For **code** rules (feature folders, server actions, query hooks), see [`conventions.md`](conventions.md). For the **RBAC matrix**, see [`access-control.md`](access-control.md).

## Contents

- [Principles](#principles)
- [Visual foundations](#visual-foundations)
- [Layout shell](#layout-shell)
- [Page anatomy](#page-anatomy)
- [Component bricks](#component-bricks)
- [States](#states)
- [Flows](#flows)
- [Navigation](#navigation)
- [Notifications](#notifications)
- [Conditional rendering](#conditional-rendering)

---

## Principles

The design is **functional, not decorative** — no heavy shadows, no colorful gradients, no oversized icons. Three rules drive every choice:

| Principle              | What it looks like in practice                                                                                                                              |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Consistency via wrappers | Almost nothing from MUI is used raw. `CustomTextField`, `DATA_GRID_DEFAULTS`, `notifySuccess`, `ConfirmDialog` — change one value, change the whole app. |
| Short, predictable scale | Spacing lives in `1/2/3/4` of the MUI scale. Typography in 4 variants (`h6/subtitle2/body2/caption`). Colors via theme tokens — never hex literals.       |
| Same anatomy everywhere  | `h6` page title + `mb: 2` + body inside `maxWidth: 1700px`. Users never have to "figure out" how a page works.                                            |

---

## Visual foundations

### Palette

Defined in [`packages/ui/src/theme/themePrimitives.ts`](../packages/ui/src/theme/themePrimitives.ts). Five scales (`brand` blue, `gray`, `green`, `orange`, `red`) with 9 stops each. **Never use a hex literal in a component** — always go through the theme:

| Token                             | Light                | Dark                  | When to use                          |
| --------------------------------- | -------------------- | --------------------- | ------------------------------------ |
| `primary.main`                    | `brand[400]`         | `brand[400]`          | Secondary CTAs, links, focus ring    |
| `text.primary`                    | `gray[800]`          | white                 | Main copy                            |
| `text.secondary`                  | `gray[600]`          | `gray[400]`           | Hints, metadata, captions            |
| `background.default`              | `hsl(0, 0%, 99%)`    | `gray[900]`           | Page background                      |
| `background.paper`                | `hsl(220, 35%, 97%)` | `hsl(220,30%,7%)`     | Sidebar, outlined Cards              |
| `divider`                         | `alpha(gray[300],.4)`| `alpha(gray[700],.6)` | All borders (never black)            |
| `success/warning/error/info.main` | scale                | scale                 | Semantic status                      |

**Semantic colors** — always via theme: green = OK / success, orange = warning, red = error / destructive, blue = in-progress, gray = neutral / disabled.

### Typography

Inter, 14px base. The scale is intentionally compressed — **don't use `h1`/`h2`/`h3` as visual hierarchy in pages**, they're reserved for specific contexts (auth screens).

| Variant         | Size  | Weight | Where                                  |
| --------------- | ----- | ------ | -------------------------------------- |
| `h6`            | 18px  | 600    | Page title, section header             |
| `h4`            | 24px  | 600    | StatCard value                         |
| `subtitle2`     | 14px  | 500    | FilterCard title, label inside a card  |
| `body1`/`body2` | 14px  | 400    | Main content                           |
| `caption`       | 12px  | 400    | `FormLabel`, hints, metadata           |

### Shape and elevation

- `borderRadius: 8` globally. Dialogs override to `10px`. Chips use `999px` (pill).
- **Shadows off by default** on Card, Paper, Button. The one visual exception is the primary `contained` Button, which has a gray gradient + inset shadow — that's the most "product" touch in the theme, intentional.
- Focus ring is always `3px solid alpha(primary.main, 0.5)` + `outlineOffset: 2px`. Visible and accessible.

### Spacing scale

Short and disciplined. **There are no loose values** (no `1.7`, `2.3`). If a layout needs one, the layout is wrong.

| `sx` value | Pixels | Where                                                                              |
| ---------- | ------ | ---------------------------------------------------------------------------------- |
| `0.5`      | 4px    | Inner gap in micro-components (StatCard)                                           |
| `1`        | 8px    | Compact action bars, `DialogActions` spacing                                       |
| `1.5`      | 12px   | Padding inside list items                                                          |
| `2`        | 16px   | **Canonical**: `mb` after a page title, gap between Grid2 cards, padding of cards  |
| `3`        | 24px   | Vertical spacing in forms, shell side gutters (`mx: 3`)                            |
| `4`        | 32px   | Gap between main shell sections, gap between columns in FormGrid                   |
| `5`        | 40px   | Shell bottom padding (`pb: 5`)                                                     |

---

## Layout shell

Implemented in [`apps/web/layouts/Dshb.tsx`](../apps/web/layouts/Dshb.tsx).

```
┌─────────────┬─────────────────────────────────────────────┐
│  SideMenu   │  Header (breadcrumbs + color mode)          │
│  240px      ├─────────────────────────────────────────────┤
│  permanent  │  <Stack mx:3 pb:5 spacing:2 alignItems:ctr> │
│             │    <Box maxWidth:1700px gap:4>              │
│  - Sections │      {children}                             │
│  - Avatar   │      <Copyright />                          │
│  - Options  │    </Box>                                   │
└─────────────┴─────────────────────────────────────────────┘
```

Shell invariants:

- **`maxWidth: 1700px`** centered. Every page respects it — some duplicate the wrapper internally to look right even if rendered in isolation.
- **Gutters** `mx: 3` (24px) sides, `pb: 5` (40px) bottom.
- **`gap: 4`** (32px) between the page body and `Copyright`.
- The **Header** sits outside the inner container; only breadcrumbs + color-mode toggle. Never put contextual page actions there.

### Sidebar

[`apps/web/components/layout/SideMenu.tsx`](../apps/web/components/layout/SideMenu.tsx) + [`MenuContent.tsx`](../apps/web/components/layout/MenuContent.tsx).

- 240px, `permanent` on `md+`. On mobile it collapses to `AppNavbar` + `SideMenuMobile`.
- **Declarative sections** with `ListSubheader` at 12px/600 (Home, Management, etc.).
- Labels come from `ROUTE_LABELS` in [`apps/web/constants/app-routes.ts`](../apps/web/constants/app-routes.ts) — single source of truth for breadcrumbs + sidebar + page metadata.
- Items use `List dense` + `Rounded` icon + label.
- **Filtered by role at render time** via `hasAccess(item.href, roles)`. Whole sections vanish if the user has no items to see — see [`access-control.md`](access-control.md).
- Footer is fixed: 36px avatar + name/email + `OptionsMenu`. Above it, `bottomLinks` (About, Report issue — external) are rendered separately so secondary links don't blend with the main nav. External items use `<a target="_blank">` instead of `next/link`.

---

## Page anatomy

Every page follows the canonical skeleton:

```tsx
<Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
  <Box ou Stack direction="row" sx={{ mb: 2, ... }}>
    <Typography component="h2" variant="h6">Title</Typography>
    {/* optional: primary button or refresh actions on the right */}
  </Box>

  {/* body */}
</Box>
```

**Rules:**

- Title is always `variant="h6"`. There is no `h1` visual in pages.
- `mb: 2` between header and body — invariant.
- Primary action lives **top-right** of the page, `variant="contained"`, with a `Rounded` `startIcon` (`AddRoundedIcon`, `RefreshRoundedIcon`).
- Header with action: `Stack direction="row" justifyContent="space-between" alignItems="center"`.

### Body variations

| Page type            | Body pattern                              | Example in this template       |
| -------------------- | ----------------------------------------- | ------------------------------ |
| CRUD list            | DataGrid + actions column                 | Users (`/users`)               |
| Metrics + table      | StatCards in `Grid2` + table below        | Dashboard (`/dashboard`)       |
| Resource detail      | `ArrowBackLink` + form + preview aside    | User detail (`/users/[id]`)    |
| Side drawer preview  | `AppDrawer` triggered from a row          | Users (View action)            |
| Settings form        | `FormGrid.Card` + `FormGrid.Aside`        | Account (`/account`)           |
| Static page          | `Stack` of `Typography`                   | About (`/about`)               |

---

## Component bricks

### Card

Override defined in [`packages/ui/src/theme/customizations/surfaces.ts`](../packages/ui/src/theme/customizations/surfaces.ts).

- **Default**: gray-50 background, **16px padding** applied on the `Card` itself, gap 16px, divider border, no shadow.
- **`variant="outlined"`**: white background, same border + 16px padding. **Most common variant.**
- The canonical 16px padding **comes from `Card`**, not `CardContent`. The theme zeros the default `CardContent`/`CardHeader`/`CardActions` padding (see surfaces.ts), so `<Card><CardContent>{...}</CardContent></Card>` is already correct without `sx`. Override only when you need an edge-to-edge layout.

**Card with a colored left border** (`borderLeft: '3px solid', borderLeftColor: 'success.main'`) — use to signal state without a chip.

**Clickable card (`ClickableCard`)** — wrapper in [`apps/web/components/ClickableCard.tsx`](../apps/web/components/ClickableCard.tsx) for cards that navigate when clicked. Wraps three things that otherwise visually clash:

1. Wraps content in `<CardActionArea component={Link}>` (semantic anchor + focus + ripple)
2. Disables the gray `focusHighlight` from `CardActionArea` (it overlaps the outlined border and creates "card-inside-card")
3. Shows a discreet `NorthEastRoundedIcon` in the top-right as a "clickable" cue (color `text.disabled` at rest, `primary.main` on hover alongside the border)

Use it whenever an outlined Card should navigate. Without `href`, it passes children through with no action area.

### FilterCard and FormGrid

Compound components in `@template/ui`:

- **`FilterCard`** — `<FilterCard.Root> / .Header / .Content>`. Always `mb: 2`, content as `Grid2` 2-col responsive. Footer with **Apply** (`contained`, `SearchRoundedIcon`) + **Reset** (`outlined`, `RestartAltRoundedIcon`).
- **`FormGrid`** — `<FormGrid.Root> / .Card / .Inputs / .Aside>`. 2-column layout on desktop, stacked on mobile. Gap 4 between columns, gap 3 between inputs.

The "draft vs applied" filter pattern — user builds the filter, only fires the query when they click Apply. Avoids refetching on every keystroke.

### Inputs

**`CustomTextField` instead of raw `TextField`** — centralizes a11y and styling tweaks. Pattern is always `FormControl + FormLabel + CustomTextField` — never use MUI's inline `label` prop. This keeps labels in `caption` (12px) above the input and reserves `helperText` for error messages (with `' '` as fallback so the layout doesn't jump).

| Component                 | When to use                                |
| ------------------------- | ------------------------------------------ |
| `CustomTextField`         | Text, number, email, password              |
| `CustomAutocomplete`      | Single-select with search                  |
| `CustomMultiAutocomplete` | Multi-select with checkbox and chips       |
| `CustomDatePicker`        | Dates                                      |
| `Controller` (RHF)        | Any component that isn't a native input    |

All forms use **React Hook Form + Zod resolver**. The schema doubles as validation, type definition, and source of error messages.

**`setSubmitting(false)` in `catch`, never in `finally`** — if you put it in `finally`, the button re-enables before the toast/navigation fires, which lets the user double-click.

### Buttons

| Context                | `size`            | `variant`                                      |
| ---------------------- | ----------------- | ---------------------------------------------- |
| Page header            | `medium` (default)| `contained`                                    |
| Inside panel / card    | `small`           | `contained` or `outlined`                      |
| Dialogs                | `medium`          | `contained` (primary) / `outlined` (cancel)    |
| Secondary actions      | `small`           | `outlined`                                     |
| "View all" in a section| `small`           | `text`                                         |

**Action hierarchy:**

1. Primary — `contained`, right-aligned, one per context
2. Secondary — `outlined`, left or beside
3. Tertiary — `text` (table links, "view all")
4. Destructive — hidden in a `MoreVertRoundedIcon` (kebab) → `ConfirmDialog`

### DataGrid

Every table uses `DATA_GRID_DEFAULTS` from `@template/ui/DataGridDefaults`. Centralizes pagination, slot customizations, and row striping.

- `pageSizeOptions={[10, 20, 50]}`, default 20.
- Loading via the `loading={isLoading}` prop — MUI ships a built-in skeleton.
- Grids with column filters add `FILTER_PANEL_SLOT_PROPS` to `slotProps`.

**Custom cells** — use `@template/ui/DataGridCells` instead of inline JSX:

- `PrimaryCell` — bold text, used for titles and names
- `SecondaryCell` — muted text with overflow tooltip, shows `—` if empty
- `DateCell` — date formatted via `formatDate`/`formatDateTime`

The **actions column always goes last**: either visualize/edit `IconButton`s, or an `ActionsMenu` kebab.

### Icons

**Always `Rounded`** — `HomeRoundedIcon`, not `HomeIcon`. Mixing icon families breaks consistency. Default size `medium`; in chips/cells use `sx={{ fontSize: 16 }}`.

| Action          | Canonical icon                            |
| --------------- | ----------------------------------------- |
| Create          | `AddRoundedIcon`                          |
| Refresh         | `RefreshRoundedIcon`                      |
| Actions menu    | `MoreVertRoundedIcon`                     |
| Filter          | `FilterListRoundedIcon`                   |
| Sort            | `SwapVertRoundedIcon`                     |
| Apply search    | `SearchRoundedIcon`                       |
| Reset           | `RestartAltRoundedIcon`                   |
| Breadcrumb sep. | `NavigateNextRoundedIcon`                 |

### Semantic status

Pair status (success/warning/error/info) with Chip color, `LinearProgress` color, or `borderLeft: 3px solid <token>.main` on cards.

**Common applications:**

- `Chip` with a `color` prop in lists
- `borderLeft: 3px solid <color>.main` on status cards
- `LinearProgress` colored by threshold (`≥80% success`, `50–79% warning`, `<50% error`) with `height: 6, borderRadius: 3`

---

## States

| Context                      | Pattern                          | Why                                                  |
| ---------------------------- | -------------------------------- | ---------------------------------------------------- |
| Full-page loading            | `Skeleton` mirroring the layout  | Avoids layout shift when content arrives             |
| Form loading                 | `Skeleton` of the fields         | Users see the structure before the data              |
| DataGrid loading             | `loading={isLoading}` (built-in) | MUI ships a skeleton overlay                         |
| Partial content (dialog)     | `CircularProgress`               | Spinner is fine in small surfaces                    |
| Fetch failure                | `<ErrorState onRetry={refetch}>` | `onRetry` keeps filters via React Query              |
| 404 (resource missing)       | `<ErrorState message="..." />`   | Without `onRetry` — retrying won't help              |
| Empty query result           | `<EmptyState message="..." />`   | 48px icon + message                                  |
| Error inside a dialog        | `<Alert severity="error" />`     | When the error coexists with other visible content   |
| Maintenance                  | `<MaintenanceState />`           | Temporary unavailability                             |

**Don't use a spinner full-screen alone** — always use Skeleton matching the layout, to preserve the content "ghost". A big spinner reads as "frozen page".

---

## Flows

### Orthodox CRUD (users)

1. **List** (DataGrid) → **Create** action top-right → **Dialog `maxWidth="sm"`** → submit → toast → invalidate cache → list updates.
2. **Edit** opens the **same Dialog** pre-filled (`editing` state on the page).
3. **Delete / disable** lives in a kebab menu → `ConfirmDialog` → destructive action (`contained`, `color="error"`, `autoFocus`) → toast.

**Dialog anatomy for CRUD:**

- `maxWidth="sm" fullWidth`
- `<DialogTitle>` is imperative ("Create user" / "Edit user")
- `<DialogContent>` with `<Stack spacing={2} sx={{ mt: 1 }}>` (mt 1 because DialogContent has built-in padding-top)
- `<DialogActions>`: **Cancel** (`outlined`, left) + **Save** (`contained`, right)
- On edit, `disabled={!isDirty || isSubmitting}`. On create, `disabled={isSubmitting}`.
- `loading={isSubmitting}` on the primary button (Button v6+ has native `loading`).

Reference: [`apps/web/app/(private)/users/_components/UserDialog.tsx`](<../apps/web/app/(private)/users/_components/UserDialog.tsx>).

### Destructive confirmation dialog

Standard component [`@template/ui/ConfirmDialog`](../packages/ui/src/components/ConfirmDialog.tsx).

- `maxWidth="xs"`, imperative title ending in "?" ("Delete user?", "Archive campaign?").
- `description` explains the consequence ("This will permanently remove …").
- Triggered from `ActionsMenu` (kebab) — never a loose button on a row.

### Drill-down (detail pages)

1. **List** → click on the name or the eye icon → **detail page** with dynamic breadcrumb.
2. Detail starts with an **`ArrowBackLink`** back to the parent, then page title, then content (Tabs, FormGrid, etc.).
3. Back navigation is via the breadcrumb or the `ArrowBackLink` — never add a separate "Back" button.

### Side-drawer preview (quick look)

When a row's details fit on one screen and the user shouldn't have to leave the listing, open a side drawer instead of navigating. Pattern shown by `UserDetailsDrawer` on `/users`.

1. **Actions column** holds three IconButtons: **View** (`VisibilityRoundedIcon`), **Edit** (`EditRoundedIcon`), **Delete** (`DeleteOutlineRoundedIcon`).
2. Clicking **View** opens an `AppDrawer` from the right with a header (avatar + name + email) and a `StyledTable` of attribute rows.
3. A subtle **Edit** button in the drawer header links to the full detail page (`/users/[id]`) when the preview is no longer enough.
4. Closing the drawer leaves the user exactly where they were in the list — pagination, scroll, filters all intact.

Three CRUD patterns now coexist on the same screen so anyone forking the template has a live reference for each:

| Pattern              | Trigger              | Use it when                                                          |
| -------------------- | -------------------- | -------------------------------------------------------------------- |
| Modal Dialog         | Edit icon in row     | Quick inline edit with a short form; no deep linking needed          |
| **Side drawer**      | View icon in row     | Read-only preview without leaving the listing                        |
| Detail page          | Drawer's Edit button | Multi-section editing, deep linking (URL is shareable)               |

### Settings form (account)

Same anatomy as a Dialog, without the wrapper. Footer with `justifyContent="space-between"`: Cancel on the left, Save on the right. **Cancel resets the form to `initialValuesRef.current`** (it doesn't navigate — you're already on the page). Reference: [`apps/web/app/(private)/account/page.tsx`](<../apps/web/app/(private)/account/page.tsx>).

---

## Navigation

### Breadcrumbs

[`apps/web/components/layout/NavbarBreadcrumbs.tsx`](../apps/web/components/layout/NavbarBreadcrumbs.tsx).

Static pages use `ROUTE_LABELS` automatically — the component resolves the path → label.

Dynamic pages (detail pages) set their own via `useBreadcrumbs([...])`, because the label depends on async data. **An empty label (`''`) renders a `Skeleton`** in the breadcrumb while data loads, keeping the slot reserved.

Separator: `NavigateNextRoundedIcon`. Last crumb is `Typography` bold; previous ones are `Link` with hover underline.

### Sidebar menu

Declarative sections in `MenuContent.tsx`. Labels come from `ROUTE_LABELS` to stay consistent with breadcrumbs and routes. The menu auto-filters items the user can't access — full matrix in [`access-control.md`](access-control.md).

Secondary links (About, Report issue) live in `bottomLinks` and render anchored at the bottom — separated so they don't blend with the main nav.

---

## Notifications

Toasts via `sonner`, wrappers in `@template/ui/notifications`:

| Function        | When                                         |
| --------------- | -------------------------------------------- |
| `notifySuccess` | Mutation succeeded (created, updated, etc.)  |
| `notifyError`   | Mutation failed (use `Result.error` message) |
| `notifyInfo`    | Non-critical info                            |
| `notifyWarning` | Warnings (cooldown, soft block)              |

**Never use inline `Alert` for success confirmation** — toast is the channel. `Alert severity="error"` is only for errors that coexist with other visible content (e.g. inside a dialog).

---

## Conditional rendering

| Case                | Pattern                          |
| ------------------- | -------------------------------- |
| Show or don't       | `{condition && <Component />}`   |
| One or the other    | `{condition ? <A /> : <B />}`    |
| Loading/error guard | Early return with `if`           |

**Never nest ternaries** — extract to a variable or early return.
