# Plan: Database Model Review + Institution Readiness

**Goal:** Fix schema bugs, standardize conventions, add missing indexes, and prepare all tables for institution-scoped multi-tenancy without breaking current functionality.

---

## Current Collections

| Collection | Status |
|---|---|
| `users` | Missing `institution_id`, field naming inconsistent |
| `schools` | Legacy — being migrated to `institutions` |
| `institutions` | New — schema looks good, not fully wired |
| `programs` | Has `school_id` — should get `institution_id` |
| `courses` | Has `institution_id` in TS but `institutions_id` in schema (typo) |
| `units` | No institution link |
| `subjects` | No institution link |
| `grades` | No institution link |
| `topics` | No institution link |
| `media_content` | No `institution_id`, no `is_visible` flag |
| `user_roles` | `permission_ids` typed as `user_permissions[]` but should be `ObjectId[]` |
| `user_role_mappings` | Good — bridges users and roles |
| `user_permissions` | Exists but not enforced anywhere |
| `settings` | Typo: `upated_at` instead of `updated_at` |
| `preferences` | `updated_by_id` typed as `Date` instead of `ObjectId` |
| `bookmarks` | Schema exists — not wired to any UI |
| `media_reactions` | Good |
| `page_views` | Good |
| `searches` | Good |
| `content_categories` | In collections, no schema defined |
| `feed_back` | All fields optional including `_id` — risky |
| `languages` | All optional — should have required `name` |
| `page_links` | Uses `page-links` (hyphen) in DB name — inconsistent with `page_actions` using `page-actions` |

---

## Bug Fixes (do now)

### 1. `settings` schema typo
```ts
// src/app/api/lib/db/schema.ts line ~244
upated_at: 'date?',   // BUG
updated_at: 'date?',  // FIX
```
Also fix the TypeScript type: `upated_at?: Date` → `updated_at?: Date`

### 2. `preferences` wrong type
```ts
updated_by_id?: Date;   // BUG — should be ObjectId
updated_by_id?: ObjectId; // FIX
```

### 3. `courses` schema inconsistency
TypeScript type has `institution_id?: ObjectId` but Realm schema has `institutions_id: 'objectId?'`
```ts
// Fix schema key name:
institution_id: 'objectId?',  // not institutions_id
```

### 4. `user_roles.permission_ids` type
Currently typed `permission_ids: user_permissions[]` — embeds full objects.  
In MongoDB this is stored as references (ObjectIds). Fix the TS type:
```ts
permission_ids: ObjectId[];  // references, not embedded
```

### 5. `feed_back` — `_id` should be required
```ts
_id: ObjectId;  // not optional
```

### 6. `p_fetchRandomMediaContent` — unprotected `$unwind`
In `pipelines.ts`, the `$unwind: '$user'` has no `preserveNullAndEmptyArrays: true`. Any media without a `created_by_id` user will be silently dropped from random results. Add `preserveNullAndEmptyArrays: true`.

---

## Institution Readiness (schema additions — non-breaking)

### Strategy
- Add `institution_id` as **optional** field to all content tables
- When `institution_id` is null/absent → global content (visible to all)
- When set → content scoped to that institution only
- This is the simplest approach: additive, backward-compatible, no migration needed for existing data

### Fields to add

| Collection | Field to add |
|---|---|
| `media_content` | `institution_id?: ObjectId` |
| `programs` | `institution_id?: ObjectId` (prefer over `school_id` long term) |
| `courses` | already has it (fix typo first) |
| `units` | `institution_id?: ObjectId` |
| `subjects` | `institution_id?: ObjectId` |
| `grades` | `institution_id?: ObjectId` |
| `topics` | `institution_id?: ObjectId` |
| `users` | `institution_id?: ObjectId` (primary affiliation) |

### New collection: `institution_memberships`
For users belonging to multiple institutions:
```ts
type institution_memberships = {
  _id: ObjectId;
  user_id: ObjectId;
  institution_id: ObjectId;
  role: 'admin' | 'member';  // institution-level role
  joined_at: Date;
  invited_by_id?: ObjectId;
}
```
Index: `{ user_id: 1, institution_id: 1 }` unique compound

### New collection: `institution_invites`
For invite-based onboarding:
```ts
type institution_invites = {
  _id: ObjectId;
  institution_id: ObjectId;
  email: string;
  token: string;  // hashed invite token
  invited_by_id: ObjectId;
  expires_at: Date;
  used_at?: Date;
}
```
Index: `{ token: 1 }` unique, `{ email: 1, institution_id: 1 }`

---

## MongoDB Indexes to Add

Add a migration file: `src/app/api/lib/db/migrations/addIndexes.ts`

```ts
// media_content
db.collection('media_content').createIndex({ grade_id: 1 })
db.collection('media_content').createIndex({ subject_id: 1 })
db.collection('media_content').createIndex({ unit_id: 1 })
db.collection('media_content').createIndex({ topic_id: 1 })
db.collection('media_content').createIndex({ institution_id: 1 })
db.collection('media_content').createIndex({ name: 'text' })  // for text search

// users
db.collection('users').createIndex({ email: 1 }, { unique: true })
db.collection('users').createIndex({ institution_id: 1 })

// user_role_mappings
db.collection('user-role-mappings').createIndex({ user_id: 1 }, { unique: true })

// media_reactions
db.collection('media_reactions').createIndex({ media_content_id: 1, user_id: 1 }, { unique: true })

// institution_memberships
db.collection('institution_memberships').createIndex({ user_id: 1, institution_id: 1 }, { unique: true })
db.collection('institution_memberships').createIndex({ institution_id: 1 })

// institution_invites
db.collection('institution_invites').createIndex({ token: 1 }, { unique: true })
db.collection('institution_invites').createIndex({ email: 1, institution_id: 1 })

// programs / courses
db.collection('programs').createIndex({ institution_id: 1 })
db.collection('courses').createIndex({ institution_id: 1 })
```

---

## DB Connection Fix (`src/app/api/lib/db/index.ts`)

Current production code creates a fresh `MongoClient` on every `dbClient()` call. Fix:

```ts
// Use module-level singleton for production too
if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
const mongoClientPromise = global._mongoClientPromise;

export const dbClient = async () => {
  const client = await mongoClientPromise;
  return client.db(process.env.MONGODB_DB);
};
```

Remove the try/catch that returns `null` from `dbClient()` — callers already handle null, but a real connection error should throw/surface, not silently return null and cause confusing downstream errors.

---

## TypeScript Types to Update

**`src/types/media-content/index.ts`:**
Add `institution_id?: string` and `external_url?: string` to `T_RawMediaContentFields`

**`src/app/api/lib/db/schema.ts`:**
- Fix all bugs listed above
- Add `institution_id` to relevant schemas
- Add `institution_memberships` and `institution_invites` schemas

**`src/app/api/lib/db/collections.ts`:**
- Add `institution_memberships` and `institution_invites` entries
- Fix `page_links` label (currently says "Media Content" — copy-paste bug)

**`src/app/api/lib/db/types.ts`:**
- Add `institution_memberships` and `institution_invites` to `T_dbCollection`

---

## Steps (in order)

1. Fix schema bugs (settings typo, preferences type, courses inconsistency, user_roles type, feed_back _id)
2. Fix `p_fetchRandomMediaContent` unwind bug
3. Fix DB connection singleton
4. Add `institution_id` (optional) to all content collections' TS types and schemas
5. Add `institution_memberships` and `institution_invites` schemas + collections
6. Write `addIndexes` migration
7. Update `T_dbCollection` type and `dbCollections` object
8. Fix `page_links` label copy-paste bug in collections
9. Update API query handlers to filter by `institution_id` when present in session (future step — just wire the optional filter for now)
