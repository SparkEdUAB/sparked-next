import { MongoClient } from 'mongodb';
import { runMigrations } from './migrate';

if (!process.env.MONGODB_URI) {
  console.error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sparked'; // Just to allow the build to pass
const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _migrationsRun: boolean | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      // Reset so the next request gets a fresh attempt
      global._mongoClientPromise = undefined;
      return Promise.reject(err);
    });
  }
  return global._mongoClientPromise;
}

export const dbClient = async () => {
  try {
    const client = await getClientPromise();
    const db = client.db(process.env.MONGODB_DB);

    if (!global._migrationsRun) {
      global._migrationsRun = true; // set before await to prevent concurrent runs
      await runMigrations(db);
    }

    return db;
  } catch {
    return null;
  }
};

export default getClientPromise();
