import { dbClient } from '.';
import { runMigrations } from './migrate';

export async function initializeDatabase() {
  const db = await dbClient();
  if (!db) return;
  await runMigrations(db);
}
