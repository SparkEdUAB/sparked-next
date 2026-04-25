# Plan: Database Migration System

**Goal:** Replace the ad-hoc migration approach (single `addDefaultRoles.ts` run at startup) with a versioned, trackable migration system that is safe to run in production, idempotent, and easy to extend.

---

## Current State

- One migration file: `src/app/api/lib/db/migrations/addDefaultRoles.ts`
- Invoked in `src/app/api/lib/db/init.ts` via `initializeDatabase()` — called at app startup
- No tracking: no record of which migrations have run, no ordering, no rollback
- If more migrations are added to `initializeDatabase()`, they all run every startup (even if already applied) — only idempotency guards prevent damage
- No CLI tool to run migrations manually or check status

---

## Design

### Migration Record Collection

Add a `_migrations` collection to MongoDB. Each applied migration gets one document:

```ts
type MigrationRecord = {
  _id: ObjectId;
  name: string;       // e.g. "001-add-default-roles"
  applied_at: Date;
  duration_ms: number;
}
```

Index: `{ name: 1 }` unique — prevents double-apply at the DB level.

### Migration File Convention

Each migration is a `.ts` file in `src/app/api/lib/db/migrations/`:

```
migrations/
  001-add-default-roles.ts
  002-add-indexes.ts
  003-fix-schema-typos.ts
  004-add-institution-id-fields.ts
  005-add-institution-collections.ts
```

Naming: `NNN-kebab-description.ts` where `NNN` is zero-padded integer. Migrations run in filename order.

Each file exports one async function named `up`:

```ts
// migrations/002-add-indexes.ts
import { Db } from 'mongodb';

export async function up(db: Db): Promise<void> {
  await db.collection('media_content').createIndex({ grade_id: 1 });
  // ... more indexes
}

export const name = '002-add-indexes';
```

### Migration Runner

`src/app/api/lib/db/migrate.ts` — core runner:

```ts
import { Db } from 'mongodb';

export async function runMigrations(db: Db): Promise<void> {
  // 1. Ensure _migrations collection + unique index exist
  await db.collection('_migrations').createIndex({ name: 1 }, { unique: true });

  // 2. Discover all migration modules (statically imported registry)
  const migrations = getMigrationRegistry(); // see below

  // 3. For each migration in order:
  for (const migration of migrations) {
    const already = await db.collection('_migrations').findOne({ name: migration.name });
    if (already) continue;

    const start = Date.now();
    await migration.up(db);
    await db.collection('_migrations').insertOne({
      name: migration.name,
      applied_at: new Date(),
      duration_ms: Date.now() - start,
    });

    console.log(`[migrate] Applied: ${migration.name}`);
  }
}
```

### Migration Registry

Since Next.js/Node doesn't support dynamic `fs.readdir` in edge/serverless, use a static registry:

```ts
// src/app/api/lib/db/migrations/index.ts
import { up as up001, name as name001 } from './001-add-default-roles';
import { up as up002, name as name002 } from './002-add-indexes';
// ... add new migrations here

export const migrations = [
  { name: name001, up: up001 },
  { name: name002, up: up002 },
];
```

Adding a migration = create the file + add one line to the registry. No magic, no filesystem scanning.

### Startup Integration

Update `src/app/api/lib/db/init.ts`:

```ts
import { dbClient } from '.';
import { runMigrations } from './migrate';

export async function initializeDatabase() {
  const db = await dbClient();
  if (!db) return;
  await runMigrations(db);
}
```

`initializeDatabase()` is already called at startup — no change needed at call site.

### CLI Script

Add `src/scripts/migrate.ts` for manual runs (useful for production deploys, debugging):

```ts
// Run with: npx tsx src/scripts/migrate.ts
import { MongoClient } from 'mongodb';
import { runMigrations } from '../app/api/lib/db/migrate';

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  await runMigrations(db);
  await client.close();
  console.log('[migrate] Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

Add to `package.json`:
```json
"migrate": "dotenv -e .env.local -- tsx src/scripts/migrate.ts"
```

---

## Migrations to Write (from Plan 03)

### 001-add-default-roles.ts
Rename/refactor `addDefaultRoles.ts` → `001-add-default-roles.ts`. Export `up(db)` + `name`.

### 002-add-indexes.ts
```ts
export async function up(db: Db) {
  // media_content
  await db.collection('media_content').createIndex({ grade_id: 1 });
  await db.collection('media_content').createIndex({ subject_id: 1 });
  await db.collection('media_content').createIndex({ unit_id: 1 });
  await db.collection('media_content').createIndex({ topic_id: 1 });
  await db.collection('media_content').createIndex({ name: 'text' });

  // users
  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  // user_role_mappings
  await db.collection('user-role-mappings').createIndex({ user_id: 1 }, { unique: true });

  // media_reactions
  await db.collection('media_reactions').createIndex(
    { media_content_id: 1, user_id: 1 },
    { unique: true }
  );
}
export const name = '002-add-indexes';
```

### 003-fix-schema-typos.ts
MongoDB document fixes (rename fields on existing documents):
```ts
export async function up(db: Db) {
  // Fix settings.upated_at → updated_at
  await db.collection('settings').updateMany(
    { upated_at: { $exists: true } },
    [{ $set: { updated_at: '$upated_at' } }, { $unset: 'upated_at' }]
  );

  // Fix courses.institutions_id → institution_id
  await db.collection('courses').updateMany(
    { institutions_id: { $exists: true } },
    [{ $set: { institution_id: '$institutions_id' } }, { $unset: 'institutions_id' }]
  );
}
export const name = '003-fix-schema-typos';
```

### 004-add-institution-id-fields.ts
Adds `institution_id` index to content collections once the field starts being populated:
```ts
export async function up(db: Db) {
  for (const col of ['programs', 'courses', 'units', 'subjects', 'grades', 'topics', 'media_content', 'users']) {
    await db.collection(col).createIndex({ institution_id: 1 });
  }
}
export const name = '004-add-institution-id-fields';
```

### 005-add-institution-collections.ts
Create `institution_memberships` and `institution_invites` with their indexes:
```ts
export async function up(db: Db) {
  await db.createCollection('institution_memberships');
  await db.collection('institution_memberships').createIndex(
    { user_id: 1, institution_id: 1 },
    { unique: true }
  );
  await db.collection('institution_memberships').createIndex({ institution_id: 1 });

  await db.createCollection('institution_invites');
  await db.collection('institution_invites').createIndex({ token: 1 }, { unique: true });
  await db.collection('institution_invites').createIndex({ email: 1, institution_id: 1 });
}
export const name = '005-add-institution-collections';
```

---

## Steps (in order)

1. Update `dbClient()` to use singleton (Plan 03 prerequisite — needed so runner uses same connection)
2. Create `src/app/api/lib/db/migrate.ts` (runner)
3. Create `src/app/api/lib/db/migrations/index.ts` (registry)
4. Rename `addDefaultRoles.ts` → `001-add-default-roles.ts`, add `up(db)` export + `name`
5. Update `init.ts` to call `runMigrations(db)` instead of `addDefaultRoles()`
6. Write `002-add-indexes.ts`
7. Write `003-fix-schema-typos.ts`
8. Write `004-add-institution-id-fields.ts`
9. Write `005-add-institution-collections.ts`
10. Add all 5 to registry in `migrations/index.ts`
11. Add `migrate` script to `package.json`
12. Write `src/scripts/migrate.ts`
13. Test: run `npm run migrate` locally — confirm `_migrations` collection populated, all 5 applied once, second run is a no-op

---

## Key Properties

- **Idempotent**: `_migrations` unique index + existence check = safe to run multiple times
- **Ordered**: static registry preserves insertion order
- **Fast startup**: skip already-applied migrations with a single `findOne`
- **No framework dependency**: plain MongoDB driver, no mongoose/prisma
- **No rollback**: MongoDB schema changes are largely additive — rollback files add complexity with little benefit for this stack. Revert via a new forward migration if needed.
- **No env drift**: `npm run migrate` CLI + startup auto-run = same code path either way
