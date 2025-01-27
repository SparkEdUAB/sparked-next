import { initializeDatabase } from '@app/api/lib/db/init';

async function setup() {
  console.log('Initializing database...');
  await initializeDatabase();
  console.log('Database initialized');
  process.exit(0);
}

setup().catch(console.error);
