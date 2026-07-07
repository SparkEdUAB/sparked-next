import { initializeDatabase } from '@app/api/lib/db/init';
import { dbClient } from '@app/api/lib/db';

async function setup() {
  const db = await dbClient();
  await initializeDatabase(db);
  process.exit(0);
}

setup().catch(console.error);
