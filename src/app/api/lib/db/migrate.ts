import { Db } from 'mongodb';
import { migrations } from './migrations';

export async function runMigrations(db: Db): Promise<void> {
  // 1. Ensure _migrations collection + unique index exist
  await db.collection('_migrations').createIndex({ name: 1 }, { unique: true });

  // 2. For each migration in order:
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
