# Plan: Resource View Page Redesign (YouTube-style, no full reload)

**Closes:** #437  
**Goal:** Clicking a related media item updates only the player/details section — no full page navigation. URL stays in sync for shareability. Layout (sidebar, related list) stays mounted.

---

## Problem

`/library/media/[id]/page.tsx` is a Next.js **server component**. `RelatedMediaContentList` uses `<Link href="/library/media/{id}">` which triggers a full server-side render and page transition. The skeleton flash is visible even with App Router soft navigation because the entire route re-fetches and remounts.

---

## Architecture

Convert the media view page into a **client-driven experience**:

1. Server page component (`page.tsx`) still handles initial load (SSR, metadata, SEO)
2. A new client component `MediaContentPlayer` takes initial data as props and owns all subsequent state
3. Related item clicks fire a client-side fetch (SWR) and swap state — no navigation
4. URL is updated via `router.replace` (no scroll, no history entry) so deep links still work
5. The related list itself re-fetches when the active media changes

---

## Files to Change

### 1. `src/app/library/media/[id]/page.tsx`
- Keep server component, keep SSR + metadata generation
- Pass `initialMediaContent` and `initialRelatedMedia` to new client component

### 2. `src/components/library/MediaContentPlayer.tsx` (NEW)
```
'use client'
- Accept: initialMediaContent: T_RawMediaContentFields, initialRelatedMedia: T_RawMediaContentFields[] | null
- State: activeMedia (starts from initialMediaContent), relatedMedia (starts from initialRelatedMedia)
- On related item click:
    a. Immediately set activeMedia to clicked item (instant render, no flash)
    b. Background-fetch full metadata for clicked item via /api/media-content?mediaContentId=...&withMetaData=true
    c. Once fetched, replace activeMedia with full data
    d. Re-fetch related media for new active item
    e. Call router.replace(`/library/media/${item._id}`, { scroll: false }) to update URL
- Renders: MediaViewer + MediaDetails (below player) + RelatedMediaContentList (side)
```

### 3. `src/components/library/MediaContentView.tsx`
- Split into two smaller components:
  - `MediaViewer` — renders the actual file (video/pdf/image/iframe)
  - `MediaDetails` — title, metadata tags, reaction buttons, view count
- Both accept `mediaContent` prop and are pure display components
- Remove state/effects from here — move all to `MediaContentPlayer`

### 4. `src/components/library/RelatedMediaContentList.tsx`
- Add `onSelect?: (item: T_RawMediaContentFields) => void` prop
- When `onSelect` is provided, intercept click (prevent default navigation), call `onSelect(item)`
- When not provided, behave as before (plain `<Link>`)
- Add visual indicator for currently active item (highlight/bold)

### 5. `src/fetchers/library/fetchRelatedMedia.tsx`
- Keep server-side version for SSR
- Add client-side helper: `fetchRelatedMediaClient(mediaContent)` — same logic, uses `fetch()` directly, no `cache()`

---

## Data Flow

```
Initial load (SSR):
  page.tsx → getMediaContent(id) → fetchRelatedMedia(media) → MediaContentPlayer (props)

On related item click (client):
  click → setActiveMedia(item) [instant]
        → fetch /api/media-content?...&withMetaData=true [background]
        → setActiveMedia(fullData) [once ready]
        → fetch related for new item [background]
        → router.replace(new URL) [URL sync]
```

---

## Performance Improvements in This Feature

- **No skeleton flash** — related item click instantly shows media name + basic info from list data while full metadata loads
- **Preload thumbnails** — add `loading="eager"` on visible thumbnails in related list
- **View counter debounce** — already has 45s delay, keep it; make sure timer resets on media swap
- **Aggregation pipeline** (`p_fetchMediaContentWithMetaData`) — currently default `limit: 1000` even for single-item fetch. For `fetchMediaContentById_`, pass `limit: 1` to the pipeline instead of slicing post-fetch.
- **DB connection** — `dbClient()` creates a new `MongoClient` on every call in production. Fix: reuse the `mongoClientPromise` pattern (already used in dev mode) in production too. One client per process.

---

## URL / SEO Considerations

- On initial load: full SSR with correct metadata (title, thumbnail, description) — works today
- On client navigation: `router.replace` updates URL without triggering SSR — no metadata update, but that's acceptable (same tradeoff YouTube makes)
- For bots/crawlers: always hits SSR path → correct OG tags

---

## Steps

1. Create `MediaViewer` component (extract from `MediaContentView.tsx`)
2. Create `MediaDetails` component (extract from `MediaContentView.tsx`)
3. Add `onSelect` prop to `RelatedMediaContentList`
4. Add `fetchRelatedMediaClient` to `src/fetchers/library/fetchRelatedMedia.tsx`
5. Create `MediaContentPlayer` client component
6. Update `page.tsx` to render `MediaContentPlayer` instead of `MediaContentView`
7. Delete `MediaContentView.tsx` (now split into player + viewer + details)
8. Fix `dbClient()` connection reuse bug (production creates new client per request)
9. Fix `p_fetchMediaContentWithMetaData` — pass `limit: 1` when fetching by ID
10. Verify: click related item → no skeleton, URL updates, browser back works

---

## General Performance Issues (Fix alongside this)

### DB Connection (`src/app/api/lib/db/index.ts`)
Current production code creates a new `MongoClient` on every `dbClient()` call:
```ts
// BROKEN in production:
client = new MongoClient(uri, options);
mongoClientPromise = client.connect(); // new connection every call!
```
Fix: apply the same `global._mongoClientPromise` pattern for production, or use a module-level singleton.

### In-memory cache (`src/app/api/media-content/index.ts`)
The `cache: Record<string, ...>` object is process-local. On serverless (Vercel), each cold start loses it. Use Next.js `unstable_cache` or route-level `revalidate` (already set to 360s on the page) instead of rolling your own.

### Pipeline default limit
`p_fetchMediaContentWithMetaData` defaults `limit: 1000` — fine for list views, bad for single-item lookups. Always pass explicit limit.

### MongoDB indexes to add (via migration)
- `media_content`: `{ grade_id: 1 }`, `{ subject_id: 1 }`, `{ unit_id: 1 }`, `{ topic_id: 1 }`, `{ name: 1 }`
- `users`: `{ email: 1 }` (unique)
- `user_role_mappings`: `{ user_id: 1 }` (unique)
- `media_reactions`: `{ media_content_id: 1, user_id: 1 }` (unique compound)
