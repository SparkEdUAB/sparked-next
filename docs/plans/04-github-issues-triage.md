# Plan: GitHub Issues Triage

**Repo:** SparkEdUAB/sparked-next  
**Date reviewed:** 2026-04-19

---

## Issues to Fix

### #437 — Improve Resource view layout
**Status:** Fix  
**Plan:** See `01-resource-view-redesign.md`. Convert to client-driven media swap, no full reload on related item click. This is the most impactful UX fix.

---

### #430 — Replace eslint and fix all lint errors & warnings
**Status:** Fix  
**What to do:**
- Project already uses `oxlint` (`"lint": "npx oxlint --fix"` in package.json)
- ESLint 8.57.1 is still installed as a dependency — remove it and its config once oxlint covers all cases
- Run `npx oxlint --fix` across the codebase
- Fix remaining warnings manually (unused vars, missing deps in useEffect, etc.)
- Remove `eslint`, `eslint-config-next` from `package.json` after confirming oxlint handles everything
- Note: `eslint-config-next` has Next.js-specific rules (no-img-element, etc.) — ensure oxlint or a custom rule covers these

---

### #427 — Error 500 when updating a user from the dashboard
**Status:** Fix  
**Root cause:** `src/app/api/users/edit.ts` uses `zfd.formData()` (which parses FormData) but the handler does `request.json()` and passes JSON object to the zfd schema. This causes a parse failure → unhandled → 500.  
**Fix:** Replace `zfd.formData({ ... })` with `z.object({ ... })` and validate with `schema.parse(formBody)` directly.

---

### #412 — Revisit user roles (content-manager)
**Status:** Fix  
**Plan:** See `02-admin-panel-improvements.md` section 1b. Extend `withAuthorization` HOC to support `allowedRoles`. Content Manager role allows CRUD on media, units, topics, subjects, grades, programs — but not user management or role management. Default roles already seeded via `addDefaultRoles` migration.

---

### #411 — Login not working as expected in production
**Status:** Fix  
**What to do:**
- Issue: login redirects to URL with params instead of completing login flow
- Investigate `src/app/api/authentication` and `next-auth` config
- Likely cause: `callbackUrl` is being set to the login page URL with query params, creating a redirect loop
- Check `pages.signIn` config and `redirect` callback in NextAuth options
- Ensure `NEXTAUTH_URL` env var is set correctly in production
- Check if `withAuthorization` HOC's redirect logic passes the full URL (including search params) as `callbackUrl` — if so, strip search params before redirecting

---

### #382 — Provide list of existing higher level institutions on login
**Status:** Fix (partially, when institution feature is built)  
**What to do:**
- On login/signup page, add institution selector dropdown
- Fetch institutions list via public endpoint `/api/institution?limit=50`
- User selects their institution during registration → stored as `institution_id` on user
- Gate: only show if institutions exist (skip for solo deployments)
- Blocked by: institution management being complete (#381 foundation)

---

### #381 — Every institution should depend on a higher level organisation
**Status:** Keep open — future roadmap  
**Context:** This is about institutional hierarchy (e.g., school → district → ministry). Not needed for v1 of institution support. The current `institutions` schema supports a flat model. Add `parent_institution_id?: ObjectId` to `institutions` schema as optional now so the field exists when needed.

---

### #380 — Add setup page
**Status:** Fix  
**Plan:** See `02-admin-panel-improvements.md` section 3b. First-run wizard: create admin, set site name, create institution, seed roles, upload first content.

---

### #378 — Serve resources based on the institution
**Status:** Fix (when institution_id added to content)  
**What to do:**
- After `03-database-model-review.md` adds `institution_id` to content tables:
- API handlers for `fetchMediaContent_` add optional filter: if user's session has `institution_id`, add `{ institution_id: new BSON.ObjectId(session.institution_id) }` to query (or include null/absent docs as global content)
- Library layout reads institution context from session
- No UI changes needed — filtering is transparent

---

### #331 — Add more actions to content view
**Status:** Fix  
**What to do:**
- Download button (if file_url is a direct file)
- Share button (copy link to clipboard)
- Report button (submits to `feed_back` collection)
- Bookmark button (schema already exists in `bookmarks` collection — not wired yet → see #329)
- Add these to `MediaDetails` component (see resource view plan)

---

### #329 — Save reading materials for later access (bookmarks)
**Status:** Fix  
**What to do:**
- `bookmarks` collection already defined in schema
- Add `POST /api/bookmarks` — create bookmark for `resource_id` + `user_id`
- Add `GET /api/bookmarks` — fetch user's bookmarks
- Add `DELETE /api/bookmarks/:id`
- Add bookmark icon button to `MediaDetails` (filled = bookmarked, outline = not)
- Add `/library/bookmarks` page listing saved items
- Auth required (hide button if not logged in)

---

### #168 — Setup tests (unit & e2e)
**Status:** Fix  
**What to do:**
- Vitest is already configured (`vitest.config.ts`, `vitest.setup.tsx`) — write unit tests
- Playwright is configured (`playwright.config.ts`) — write e2e tests
- Priority unit tests:
  - `determineFileType` helper
  - `fetchRelatedMedia` fetcher (mock fetch)
  - `MediaContentPlayer` component (test state updates on related item click)
  - API handlers (mock `dbClient`)
- Priority e2e tests:
  - Library page loads and lists content
  - Click media item → view page loads
  - Click related item → content swaps without full reload
  - Admin login flow
  - Create media content flow

---

### #119 — Settings page for configuring different things
**Status:** Fix  
**Plan:** See `02-admin-panel-improvements.md` section 3a.

---

### #72 — Implement a global search
**Status:** Fix  
**What to do:**
- Search UI already exists at `/library/search` with `SearchMediaContentList`
- Backend `findMediaContentByName_` exists
- Gap: search is only in library, not global (doesn't search programs, courses, etc.)
- Fix: extend search to include content hierarchy items
- Add MongoDB text index on `media_content.name` and `media_content.description`
- Add keyboard shortcut (Cmd+K / Ctrl+K) to open search from anywhere
- Debounce already implemented via `use-debounce` hook

---

## Issues to Close

### #335 — Add automated PDF summary & automated quiz
**Status:** Close (wontfix label already applied)  
**Reason:** Out of scope for current project focus. AI summarization requires external service integration. Mark as `wontfix` and close.

### #330 — Track pages read in a PDF per user
**Status:** Close (wontfix label already applied)  
**Reason:** High complexity (browser PDF rendering events are unreliable), low ROI, wontfix label already applied.

---

## Issues to Keep Open (no action now)

### #130 — Dependency Dashboard
**Status:** Keep open  
**Reason:** Automated Renovate bot issue. Self-manages. Do not close.

---

## Recommended Fix Order

1. #427 — User update 500 (quick bug fix, high impact)
2. #411 — Login redirect bug (production blocker)
3. #437 — Resource view layout (main UX improvement)
4. #412 — User roles enforcement
5. #380 — Setup page
6. #329 — Bookmarks
7. #331 — Content view actions (share, download, report, bookmark)
8. #382 — Institution selector on login
9. #72  — Global search improvements
10. #119 — Settings page
11. #430 — ESLint → oxlint migration
12. #168 — Tests
