import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export const dbClient = async () => {
  // If we have a cached connection, return it
  if (cachedDb) {
    return cachedDb;
  }

  try {
    // If no cached client, create new connection
    if (!cachedClient) {
      cachedClient = new MongoClient(uri, options);
      await cachedClient.connect();
    }

    const db = cachedClient.db(process.env.MONGODB_DB);
    cachedDb = db;

    // Add connection error handler
    cachedClient.on('error', (error) => {
      console.error('MongoDB connection error:', error);
      cachedClient = null;
      cachedDb = null;
    });

    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cachedClient = null;
    cachedDb = null;
    return null;
  }
};
