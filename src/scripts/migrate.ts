import { MongoClient } from 'mongodb';
import { runMigrations } from '../app/api/lib/db/migrate';

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri || !dbName) {
    console.error('[migrate] MONGODB_URI and MONGODB_DB must be set');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  try {
    const db = client.db(dbName);
    await runMigrations(db);
  } finally {
    await client.close();
  }
  console.log('[migrate] Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
