import { MongoClient, MongoClientOptions } from 'mongodb';
import { initializeDatabase } from './init';

if (!process.env.MONGODB_URI) {
  console.error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI || 'mongodb://....'; // Just to allow the build to pass
// The app runs as a single small instance (0.5 vCPU / 512MB); the driver default of
// 100 pooled connections per server only costs memory and Atlas connection slots.
const options: MongoClientOptions = { maxPoolSize: 10, minPoolSize: 0 };

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoInitPromise: Promise<void> | undefined;
}

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

const mongoClientPromise = global._mongoClientPromise;

export const dbClient = async () => {
  const client = await mongoClientPromise;
  const db = client.db(process.env.MONGODB_DB);

  if (!global._mongoInitPromise) {
    global._mongoInitPromise = initializeDatabase(db);
  }

  await global._mongoInitPromise;

  return db;
};

export default mongoClientPromise;
