import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  console.error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI || "mongodb://...."; // Just to allow the build to pass
const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

const mongoClientPromise = global._mongoClientPromise;

export const dbClient = async () => {
  const client = await mongoClientPromise;
  return client.db(process.env.MONGODB_DB);
};

export default mongoClientPromise;
