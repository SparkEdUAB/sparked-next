import { Db, MongoClient } from 'mongodb';
import { initializeDatabase } from './init';

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoInitPromise: Promise<void> | undefined;
}

function getMongoClientPromise() {
  if (!global._mongoClientPromise) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
    }

    global._mongoClientPromise = new MongoClient(uri, options).connect();
  }

  return global._mongoClientPromise;
}

export const dbClient = async (): Promise<Db> => {
  const client = await getMongoClientPromise();
  const db = client.db(process.env.MONGODB_DB);

  if (!global._mongoInitPromise) {
    global._mongoInitPromise = initializeDatabase(db);
  }

  await global._mongoInitPromise;

  return db;
};

export default dbClient;
