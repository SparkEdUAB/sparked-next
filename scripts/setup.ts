import { initializeDatabase } from '@app/api/lib/db/init';

async function setup() {
  await initializeDatabase();
  process.exit(0);
}

setup().catch(console.error);
