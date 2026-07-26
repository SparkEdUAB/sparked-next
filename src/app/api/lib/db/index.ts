import { Db, MongoClient } from 'mongodb';

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
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
  return client.db(process.env.MONGODB_DB);
};

export default dbClient;
