# Plan: Complete Flowbite Removal

**Goal:** Remove `flowbite` and `flowbite-react` packages entirely, replacing every component with shadcn/ui equivalents styled with the TailAdmin brand color (`#465fff`, `--primary: 232 100% 64%`).

**Branch:** `upgrade`

**Color reference:**
- Primary brand: `#465fff` → `hsl(var(--primary))` / `bg-primary text-primary-foreground`
- Success: `bg-green-100 text-green-700`
- Destructive: `bg-red-100 text-red-700`
- Muted: `text-muted-foreground`

**shadcn replacement map:**

| Flowbite component | shadcn/ui replacement |
|---|---|
| `Button` | `@/components/ui/button` |
| `Spinner` | `@/components/ui/skeleton` or inline SVG spinner |
| `Modal` | `@/components/ui/dialog` |
| `Label` | `@/components/ui/label` |
| `TextInput` | `@/components/ui/input` |
| `Textarea` | `@/components/ui/textarea` |
| `Select` | `@/components/ui/select` |
| `FileInput` | native `<input type="file">` styled with `@/components/ui/input` |
| `Toast` | `@/components/ui/sonner` (already installed via sonner) |
| `Sidebar` | custom (already done in admin, replicate pattern) |
| `Navbar` | custom with shadcn primitives |
| `Dropdown` | `@/components/ui/dropdown-menu` |
| `Breadcrumb` | `@/components/ui/breadcrumb` |
| `Card` | `@/components/ui/card` |
| `Checkbox` | `@/components/ui/checkbox` |
| `Table` | `@/components/ui/table` |
| `List` | native `<ul>` / `<ol>` |
| `Alert` | `@/components/ui/alert` |
| `Drawer` | `@/components/ui/sheet` |
| `Flowbite` (provider) | remove — no longer needed |
| `DarkThemeToggle` | custom (already done in AdminTopbar) |
| `Avatar` | `@/components/ui/avatar` |

---

## Task 1: Auth pages (login, signup, forgot-password, reset-password)

**Files:**
- `src/components/auth/login.tsx`
- `src/components/auth/signup.tsx`
- `src/components/auth/forgot-password.tsx`
- `src/components/auth/reset-password.tsx`

**Changes:**
- Replace `Label`, `TextInput`, `Button`, `Alert`, `Spinner` imports with shadcn equivalents
- Preserve all form logic, validation, error states, and i18n
- Use `Button` from `@/components/ui/button`, `Input` from `@/components/ui/input`, `Label` from `@/components/ui/label`
- Style auth card container with `bg-card border rounded-xl shadow-sm`

**Verification:** Auth flow still works end-to-end (form submit, error states render, loading state shows)

---

## Task 2: Atom components (shared primitives)

**Files:**
- `src/components/atom/AdminloadinSpiner.tsx` — replace Flowbite Spinner with shadcn Skeleton or `<svg>` spinner using `text-primary`
- `src/components/atom/Autocomplete/Autocomplete.tsx` — replace any Flowbite inputs with shadcn Input + Popover
- `src/components/atom/SelectList/SelectList.tsx` — replace Flowbite Select with shadcn Select
- `src/components/atom/SelectDropdown/SelectDropdown.tsx` — replace Flowbite Dropdown with shadcn DropdownMenu
- `src/components/atom/UpdateButtons/UpdateButtons.tsx` — replace Flowbite Button with shadcn Button
- `src/components/atom/ReactionButtons.tsx` — replace Flowbite Button with shadcn Button
- `src/components/atom/StatsCard.tsx` — legacy stats card; replace Flowbite Card with shadcn Card (or delete if unused outside admin)

**Verification:** All atom components render correctly, interactive states work (open/close dropdowns, button clicks)

---

## Task 3: Admin legacy form/table (AdminForm, AdminTable)

**Files:**
- `src/components/admin/AdminForm/AdminFormInput.tsx`
- `src/components/admin/AdminForm/AdminFormTextarea.tsx`
- `src/components/admin/AdminForm/AdminFormSelector.tsx`
- `src/components/admin/AdminTable/AdminTable.tsx`
- `src/components/admin/AdminTable/AdminTableButtonGroup.tsx`

**Changes:**
- Replace Flowbite `TextInput`, `Label`, `Textarea`, `Select`, `Button`, `Checkbox`, `Table`, `Spinner` with shadcn equivalents
- These are legacy components used by non-admin pages; keep same API surface
- Tests in `AdminFormInput.test.tsx`, `AdminFormTextarea.test.tsx`, `AdminTableButtonGroup.test.tsx` must still pass

**Verification:** All existing tests pass (`npm test`)

---

## Task 4: Library area (library layout + components)

**Files:**
- `src/components/library/libraryLayout/LibraryNavbar.tsx`
- `src/components/library/libraryLayout/LibrarySidebar.tsx`
- `src/components/library/libraryLayout/LibraryNoOrAllItems.tsx`
- `src/components/library/LibraryBadge.tsx`
- `src/components/library/LibraryLoader.tsx`
- `src/components/library/RelatedMediaContentList.tsx`
- `src/components/layouts/library/PdfViewer/PdfViewer.tsx`
- `src/app/library/search/SearchMediaContentList.tsx`

**Changes:**
- Replace Flowbite `Navbar`, `Sidebar`, `Spinner`, `Card`, `List`, `Breadcrumb` with shadcn equivalents
- `LibrarySidebar` and `LibraryNavbar`: model after `AdminSidebar`/`AdminTopbar` pattern (already done)
- `LibraryLoader`: replace spinner with `<Loader2 className="animate-spin text-primary" />` from lucide-react
- `LibraryBadge`: replace with shadcn `Badge`

**Verification:** Library pages render, sidebar opens/closes, content loads

---

## Task 5: Portal layout and welcome page

**Files:**
- `src/components/layouts/portalLayout/index.tsx`
- `src/components/layouts/adminLayout/AdminNavbar.tsx`
- `src/components/layouts/adminLayout/AdminHeader.tsx`
- `src/components/welcomePage/HeaderSection.tsx`
- `src/components/welcomePage/LogOutButton.tsx`
- `src/providers/AppProviders.tsx`

**Changes:**
- `AppProviders.tsx`: remove `<Flowbite>` provider wrapper entirely
- `AdminNavbar.tsx` / `AdminHeader.tsx`: legacy admin layout; replace Flowbite components; these may be superceded by the new `AdminShell` — confirm if still rendered
- `portalLayout/index.tsx`: replace Flowbite `Navbar`, `DarkThemeToggle`, `Avatar`, `Dropdown` with shadcn equivalents
- `HeaderSection.tsx`, `LogOutButton.tsx`: replace Flowbite Button with shadcn Button

**Verification:** Portal renders, login/logout works, dark mode toggle works

---

## Task 6: Content CRUD views (grades, subjects, topics, units, media-content, users, roles, pages, school, programs, courses, institution)

**Files (create/edit views):**
- `src/components/grades/createGradeView.tsx`, `editGradeView.tsx`
- `src/components/subjects/createSubjectView.tsx`, `editSubjectView.tsx`
- `src/components/topic/create-topic-view.tsx`, `edit-topic-view.tsx`
- `src/components/units/create-unit-view.tsx`, `edit-unit-view.tsx`
- `src/components/media-content/create-media-content-view.tsx`, `edit-media-content-view.tsx`
- `src/components/media-content/upload-multiple/DependencySelector.tsx`
- `src/components/media-content/upload-multiple/EditResourceData.tsx`
- `src/components/media-content/upload-multiple/FileSelector.tsx`
- `src/components/media-content/upload-multiple/PreviewButton.tsx`
- `src/components/users/create-user-view.tsx`, `edit-user-view.tsx`
- `src/components/roles/create-role-view.tsx`, `edit-role-view.tsx`
- `src/components/pages/create-page-view.tsx`, `edit-page-view.tsx`
- `src/components/school/createSchoolView.tsx`, `editSchoolView.tsx`, `schoolsListView.tsx`
- `src/components/programs/createProgramView.tsx`, `editProgramView.tsx`, `programListView.tsx`
- `src/components/courses/createCourseView.tsx`, `editCourseView.tsx`, `courseListView.tsx`
- `src/components/institution/index.tsx`, `InstitutionSelector.tsx`, `InstitutionUsersView.tsx`
- `src/app/admin/settings/page.tsx`
- `src/components/molecules/DragAndDropFileInput/DragAndDropFileInput.tsx`
- `src/components/ToastMessage/ToastMessage.tsx`

**Changes:**
- Replace `Button`, `Spinner`, `Modal`, `Label`, `TextInput`, `Textarea`, `Select`, `FileInput`, `Toast`, `Drawer` with shadcn equivalents
- `ToastMessage`: replace Flowbite `Toast` with `sonner` (`import { toast } from 'sonner'`)
- `DragAndDropFileInput`: replace Flowbite `FileInput` with native `<input type="file">` + shadcn styling
- All `Modal` → shadcn `Dialog`
- All `Drawer` → shadcn `Sheet`
- All list views with Flowbite `Table`/`Checkbox` → shadcn equivalents (already done pattern in admin DataTable)

**Verification:** All 186 existing tests pass; CRUD create/edit forms render

---

## Task 7: Remove packages and clean up

**Steps:**
1. `npm uninstall flowbite flowbite-react`
2. Remove `flowbite` from `tailwind.config.js` / `tailwind.config.ts` plugins array
3. Remove `Flowbite` provider from `AppProviders.tsx` (done in Task 5)
4. Verify `grep -r "flowbite" src/` returns nothing
5. Run full test suite: `npm test`
6. Run build: `npm run build`

**Verification:** `npm run build` succeeds with zero flowbite references

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 0 | — | — |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | — | — |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | — |

**VERDICT:** NO REVIEWS YET
