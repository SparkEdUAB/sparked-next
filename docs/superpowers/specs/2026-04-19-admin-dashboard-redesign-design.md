# Admin Dashboard Redesign — Phase 1

**Date:** 2026-04-19  
**Scope:** Full admin shell (`/admin/*`) — layout, sidebar, navbar, dashboard home, all list/management pages, forms, modals, drawers, settings  
**Phase 2 (separate spec):** login/signup, landing page, library, media view pages

---

## Goals

- Modernize admin UI to match [TailAdmin demo](https://demo.tailadmin.com) aesthetic
- Replace Flowbite React in admin-only files with shadcn/ui + pure Tailwind
- Add charts and visual data summaries to the dashboard home
- Standardize all admin patterns: tables, forms, drawers, modals, page headers
- Keep Flowbite intact for non-admin pages (Phase 2 handles those)
- Maintain full dark mode support
- Maintain teal as primary brand color

---

## Tech Stack Changes

| Concern | Before | After |
|---|---|---|
| Component library (admin) | Flowbite React | shadcn/ui (Radix primitives) |
| Charts | None | Recharts |
| Dark mode toggle | Flowbite `DarkThemeToggle` | `next-themes` |
| Interactive utilities | Flowbite modals/dropdowns | shadcn/ui Dialog, Sheet, DropdownMenu |
| Loading states | Custom `LoadingSpinner` | shadcn/ui `Skeleton` |
| Non-admin pages | Flowbite React (unchanged) | Flowbite React (unchanged — Phase 2) |

### Packages to install

```bash
# shadcn/ui init (CSS variables mode, teal primary)
npx shadcn@latest init

# shadcn/ui components
npx shadcn@latest add button card table dialog sheet dropdown-menu badge avatar \
  input select textarea separator skeleton tooltip breadcrumb scroll-area pagination

# Charts
npm install recharts

# Dark mode
npm install next-themes
```

### tailwind.config.js

Add shadcn/ui CSS variable tokens to `theme.extend`. Map `--primary` to teal (`hsl(174, 72%, 40%)`). Flowbite plugin remains — it only affects non-admin pages.

---

## Architecture

### File structure changes

```
src/
  components/
    admin/
      layout/               # NEW — replaces adminLayout/
        AdminShell.tsx       # Root layout wrapper
        AdminSidebar.tsx     # TailAdmin-style fixed sidebar
        AdminTopbar.tsx      # Slim top navbar
        UserDropdown.tsx     # Avatar dropdown (profile + logout)
        ThemeToggle.tsx      # next-themes toggle
      dashboard/            # NEW
        StatsCard.tsx        # Redesigned stat card
        EntityBarChart.tsx   # Recharts bar chart
        GrowthLineChart.tsx  # Recharts line chart (stub)
        RecentActivityTable.tsx
      data-table/           # NEW — shared DataTable
        DataTable.tsx
        DataTablePagination.tsx
        DataTableEmptyState.tsx
        DataTableSkeleton.tsx
      form/                 # NEW — replaces AdminForm/
        FormSheet.tsx        # Sheet wrapper for create/edit
        FormInput.tsx        # shadcn Input + Label
        FormTextarea.tsx     # shadcn Textarea + Label
        FormSelect.tsx       # shadcn Select
      AdminForm/            # KEEP — delete after migrating all usages
      AdminTable/           # KEEP — delete after migrating all usages
  app/
    admin/
      layout.tsx            # Update to use new AdminShell
      page.tsx              # Update to use new dashboard components
      # All other pages updated in place
```

---

## Section 1 — Foundation & Theme

`tailwind.config.js` extended with shadcn/ui CSS variable tokens:

```js
theme: {
  extend: {
    colors: {
      border: 'hsl(var(--border))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',      // teal-500 equivalent
        foreground: 'hsl(var(--primary-foreground))',
      },
      // ... full shadcn token set
    }
  }
}
```

`src/app/admin/layout.tsx` wraps with `ThemeProvider` from `next-themes` (attribute="class").

---

## Section 2 — Admin Shell (Sidebar + Navbar)

### Sidebar (`AdminSidebar.tsx`)

- Fixed left, z-20, full height
- Collapsed: 80px (icons only), Expanded: 256px
- **Top:** Logo + "Sparked" text (hidden when collapsed)
- **Nav groups:**
  - **Overview:** Dashboard
  - **Content:** Grades, Subjects, Units, Topics
  - **Management:** Users, Institutions
  - **Media:** Media Content
  - **System:** Settings (with Pages/Roles sub-items)
- Active item: teal pill background (`bg-primary text-primary-foreground`)
- Hover: `hover:bg-muted`
- **Bottom:** user avatar + name + logout button (moved from navbar)
- Mobile: overlay drawer behavior (backdrop closes sidebar)
- Dark mode: `dark:bg-gray-900` sidebar background

### Top Navbar (`AdminTopbar.tsx`)

- Height: 62px, sticky top-0, z-10
- `border-b border-border bg-background/95 backdrop-blur`
- **Left:** sidebar toggle button + current page title
- **Right:** `ThemeToggle` (sun/moon icon) + notification bell (icon button, placeholder) + `UserDropdown`
- `UserDropdown`: avatar + name, dropdown with "Profile" (placeholder) and "Logout"

### Breadcrumb

- Rendered inside content area, below navbar, using shadcn/ui `Breadcrumb`
- Shows path e.g. Admin / Settings / Roles

---

## Section 3 — Dashboard Home (`/admin`)

### Stat Cards

Replace `DashbordUsageCard` with new `StatsCard`:

```
┌─────────────────────────────┐
│  [icon bg]    Entity Name   │
│  [teal icon]  1,234         │
│               ↑ up  (green) │
└─────────────────────────────┘
```

- shadcn/ui `Card` with `CardContent`
- Left: colored circle with white react-icon (each entity gets a distinct teal-adjacent color)
- Right: entity name (muted, small) + count (large bold) + trend badge
- 4-col grid xl, 3-col lg, 2-col sm, 1-col mobile
- `isPercentage` stats render as percentage cards with different icon

### Bar Chart (`EntityBarChart.tsx`)

- Recharts `BarChart` — entity names on X axis, counts on Y axis
- Single bar series, teal fill (`hsl(var(--primary))`)
- Responsive container, clean tooltip
- Data sourced from same stats API response

### Line Chart (`GrowthLineChart.tsx`)

- Recharts `LineChart` — time on X axis, count on Y axis
- **Stub for Phase 1:** renders with placeholder data shape + overlay note: "Time-series API endpoint needed"
- Teal line color, smooth curve

### Recent Activity Table (`RecentActivityTable.tsx`)

- shadcn/ui `Table`
- Columns: Type, Name, Created At, Actions
- **Phase 1 stub:** fetches latest 5 items from each entity endpoint, merges + sorts by created_at
- If no `created_at` field available, shows static placeholder rows with a note

---

## Section 4 — List/Management Pages

### Consistent page structure

Every list page (`/admin/users`, `/admin/institutions`, etc.) follows:

```
Page Header
  ├── H1 page title (left)
  └── Primary action button: "Add [Entity]" (right)
Search bar (full width)
DataTable
  ├── Sticky column headers
  ├── Skeleton rows during load
  ├── Empty state (icon + message + CTA) when no data
  └── Inline action column: Edit (pencil icon) + Delete (trash icon) with tooltips
Pagination
  └── Prev / Next + page numbers
```

### `DataTable.tsx`

Generic shadcn/ui Table wrapper accepting `columns` + `data` props. Replaces `AdminTable`.

### `DataTablePagination.tsx`

shadcn/ui `Pagination` component. Replaces infinite scroll.

### `DataTableSkeleton.tsx`

Renders N skeleton rows matching table column count. Replaces `LoadingSpinner`.

### `DeletionWarningModal`

Replace Flowbite modal with shadcn/ui `Dialog`. Same props interface — destructive confirm pattern.

---

## Section 5 — Forms, Modals & Drawers

### Create/Edit: `FormSheet.tsx`

shadcn/ui `Sheet` sliding from the right. Wraps all create/edit forms:

```
Sheet
  ├── SheetHeader: title ("Add Grade" / "Edit Grade")
  ├── SheetContent: form fields
  └── SheetFooter (sticky): Cancel button + Save button (teal primary)
```

- `FormInput` = shadcn `Input` + `Label` (replaces `AdminFormInput`)
- `FormTextarea` = shadcn `Textarea` + `Label` (replaces `AdminFormTextarea`)
- `FormSelect` = shadcn `Select` (replaces `AdminFormSelector`)

### Modals

Delete confirmations remain centered `Dialog` (not Sheet). Pattern:
- Title: "Delete [Entity]?"
- Body: warning text
- Footer: Cancel (outline) + Delete (destructive red)

### Media Content Upload

Keep `react-dropzone`. Wrap in shadcn/ui `Card` with dashed border upload zone, teal accent on hover/drag. File list below uses `Badge` for file type indicators.

---

## Section 6 — Settings Pages

`/admin/settings/pages` and `/admin/settings/roles` use the same patterns:
- Page header with title + "Add" button
- `DataTable` with same skeleton/empty/pagination treatment
- Create/edit via `FormSheet`

---

## Dark Mode

- `next-themes` `ThemeProvider` wraps admin layout (attribute="class")
- `ThemeToggle` button in navbar: sun icon (light) / moon icon (dark)
- All shadcn/ui components use CSS variables — dark mode works automatically
- Sidebar: `bg-white dark:bg-gray-900`
- Navbar: `bg-white dark:bg-gray-900 border-b`
- Cards: shadcn/ui defaults handle dark automatically

---

## Component Mapping (Flowbite → shadcn/ui)

| Flowbite (admin) | shadcn/ui replacement |
|---|---|
| `Card` | `Card`, `CardContent`, `CardHeader` |
| `Navbar` | Custom `AdminTopbar` |
| `Sidebar` (custom) | Custom `AdminSidebar` |
| Flowbite modal | `Dialog` |
| — | `Sheet` (new drawer pattern) |
| `DarkThemeToggle` | `next-themes` + custom `ThemeToggle` |
| `Spinner` / `LoadingSpinner` | `Skeleton` |
| `Table` (custom AdminTable) | `DataTable` (wraps shadcn `Table`) |
| `Badge` | `Badge` |
| `Button` | `Button` |
| `TextInput` | `Input` |
| `Textarea` | `Textarea` |
| `Select` | `Select` |

---

## What's NOT in Phase 1

- Login / Signup pages
- Landing page
- Library pages
- Media view pages
- Time-series API endpoint (line chart is stubbed)
- Recent activity dedicated API endpoint (stubbed with existing data)
- Notifications feature (bell icon is placeholder)
- User profile page (dropdown link is placeholder)

These are Phase 2 scope.

---

## Success Criteria

- Admin shell visually matches TailAdmin demo aesthetic with teal theme
- All admin pages load without Flowbite imports
- Dark mode toggles correctly across all admin pages
- Stat cards, bar chart, and line chart render on dashboard home
- All list pages have consistent header, DataTable, skeleton, empty state, pagination
- All create/edit forms open in Sheet drawers
- Delete confirmations use Dialog
- No regressions in non-admin pages (Flowbite still works there)
- Existing tests pass; new components have unit tests
