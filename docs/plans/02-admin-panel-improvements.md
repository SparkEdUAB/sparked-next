# Plan: Admin Panel Improvements

**Goal:** Make the admin panel functional, well-organized, and ready for institution-scoped management. Focus on real missing functionality, not cosmetic changes.

---

## Current State

The admin panel provides basic CRUD for: Schools, Programs, Courses, Units, Topics, Subjects, Grades, Media Content, Users, Roles, Settings (pages, page actions), and Institutions (page exists, likely not in nav).

### Identified Gaps

| Gap | Impact |
|-----|--------|
| Role permissions not enforced (content-manager can't manage content) | #412 |
| User update fails with 500 | #427 |
| No institution management in sidebar nav | Institutions feature blocked |
| Stats dashboard shows counts only — no trends, no recent activity | Low insight |
| No pagination UI on list pages | All data loaded at once |
| No search/filter in admin tables | Hard to find items at scale |
| No audit log | No accountability |
| Settings page incomplete | #119 |
| No setup/onboarding flow | #380 |
| `withMetaData` flag inconsistently used | Extra DB load |

---

## Priority 1: Fix Broken Things

### 1a. Fix user update 500 error (#427)
**File:** `src/app/api/users/edit.ts` (line in `edit.ts`)  
**Likely cause:** `zfd.formData()` parsing a JSON body. `zfd` expects `FormData`; the handler uses `request.json()` then passes to `zfd.formData().parse()`. Mismatch causes a parse error → uncaught → 500.  
**Fix:** Use `z.object()` instead of `zfd.formData()` for JSON body parsing, or parse raw JSON and validate with plain zod.

### 1b. Enforce content-manager role (#412)
**Current state:** `withAuthorization(RootLayout, { requireAdmin: true })` — any non-admin is blocked from admin panel.  
**Fix:**
- Extend `withAuthorization` HOC to accept `{ requireAdmin?: boolean; allowedRoles?: string[] }`
- Route-level: admin-destructive pages (delete users, manage roles) require `Admin` role
- Content pages (media-content, units, topics) also allow `Content Manager`
- `src/app/admin/layout.tsx` stays `requireAdmin` (broad gate)
- Individual pages that content managers should access use a more permissive check
- Add role check in sidebar — hide nav items the user can't access

### 1c. Add Institutions to admin sidebar nav
**File:** `src/hooks/useNavigation/constants.ts` (or wherever admin menu items are defined)  
Add Institutions entry pointing to `/admin/institutions`

---

## Priority 2: Usability

### 2a. Pagination in admin tables
- All list pages currently fetch with `limit`/`skip` but no UI pagination
- Add a `Pagination` component using flowbite-react `Pagination`
- Wire to existing `limit`/`skip` query params in each list hook
- Start with: Users, Media Content (largest tables)

### 2b. Search/filter in admin tables
- Add a debounced search input to `AdminTable` component
- Uses existing `findByName` endpoints (already exist for media content, users)
- Standardize the `findByName` pattern across all entities that lack it (programs, courses, etc.)

### 2c. Admin dashboard improvements
- Add recent uploads (last 5 media items with links)
- Add recent user registrations (last 5 users)
- Add quick action cards: "Upload content", "Add user", "Create course"
- Keep existing stat count cards

### 2d. Bulk operations
- `AdminTable` already has selection checkboxes — extend to support bulk status changes
- Add "bulk publish/unpublish" for media content (requires `is_visible` field on `media_content`)

---

## Priority 3: Completeness

### 3a. Settings page (#119)
The settings page (`/admin/settings`) exists but is minimal. Build:
- **Site settings:** site name, logo, contact email (stored in `settings` collection)
- **Feature flags:** enable/disable features (search, reactions, bookmarks)
- **Default role:** which role to assign to new users
- All settings read/written via `/api/config` endpoint (already exists, check `src/app/api/config`)

### 3b. Setup/onboarding page (#380)
First-run wizard for new deployments:
1. Create admin account
2. Set site name
3. Create first institution
4. Seed default roles (migration already exists: `addDefaultRoles`)
5. Upload first content
Show checklist on dashboard until all steps complete. Track completion in `settings` collection key `setup_complete`.

### 3c. Audit log
- New collection: `audit_log` — fields: `action`, `entity`, `entity_id`, `actor_id`, `timestamp`, `metadata`
- Write log entry after every create/update/delete in API handlers
- Add `/admin/audit` page showing filterable log

---

## File Map

```
src/
  app/
    admin/
      institutions/page.tsx          — already exists, wire up
      audit/page.tsx                 — NEW
      settings/page.tsx              — expand
  components/
    admin/
      AdminTable/AdminTable.tsx      — add pagination + search
      AdminTable/Pagination.tsx      — NEW
      institutions/                  — NEW (list, create, edit views)
  hooks/
    useNavigation/constants.ts       — add Institutions nav item
    useInstitution/                  — already exists, verify completeness
  app/
    api/
      audit/route.ts                 — NEW
      users/edit.ts                  — fix zfd/JSON mismatch
```

---

## Steps (in order)

1. Fix user update 500 (`src/app/api/users/edit.ts`)
2. Add Institutions to sidebar nav
3. Fix role enforcement — extend `withAuthorization` + hide inaccessible nav items
4. Add pagination to `AdminTable` + wire to Users and Media Content pages
5. Add search input to `AdminTable`
6. Complete Settings page (site config, feature flags)
7. Build setup/onboarding wizard
8. Add audit log (collection + API + admin page)
9. Improve dashboard with recent activity
