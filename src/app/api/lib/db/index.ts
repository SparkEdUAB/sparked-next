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
    return client.db(process.env.MONGODB_DB);
  } catch {
    return null;
  }
};

export default getClientPromise();
