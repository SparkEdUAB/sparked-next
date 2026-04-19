import { Db } from 'mongodb';
import { migrations } from './migrations';

export type Migration = {
  name: string;
  up: (db: Db) => Promise<void>;
};

export async function runMigrations(db: Db): Promise<void> {
  // 1. Ensure _migrations collection + unique index exist
  await db.collection('_migrations').createIndex({ name: 1 }, { unique: true });

  // 2. For each migration in order:
  for (const migration of migrations) {
    const already = await db.collection('_migrations').findOne({ name: migration.name });
    if (already) continue;

    const start = Date.now();
    // NOTE: up() and insertOne() are not atomic. If up() succeeds but insertOne() fails,
    // the migration will re-run on the next startup. Every migration must be idempotent.
    try {
      await migration.up(db);
    } catch (err: any) {
      const detail = err?.errorResponse?.errmsg ?? err?.message ?? String(err);
      console.error(`[migrate] FAILED: ${migration.name} — ${detail}`);
      // Do not throw — app continues with remaining migrations skipped for this run.
      // Fix the migration and restart to retry.
      break;
    }
    await db.collection('_migrations').insertOne({
      name: migration.name,
      applied_at: new Date(),
      duration_ms: Date.now() - start,
    });

    console.log(`[migrate] Applied: ${migration.name} (${Date.now() - start}ms)`);
  }
}
