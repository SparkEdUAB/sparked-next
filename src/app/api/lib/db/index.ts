import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  console.error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI || "mongodb://...."; // Just to allow the build to pass
const options = {};

let client: MongoClient;
let mongoClientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  //@ts-ignore
  if (!global._mongomongoClientPromise) {
    client = new MongoClient(uri, options);
    //@ts-ignore
    global._mongomongoClientPromise = client.connect();
  }
  //@ts-ignore
  mongoClientPromise = global._mongomongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  mongoClientPromise = client.connect();
}

export const dbClient = async () => {
  try {
    const mongoClient = new MongoClient(uri, options);
    const dbConnection = await mongoClient.connect();
    return dbConnection.db(process.env.MONGODB_DB);
  } catch (error) {
    return null;
  }
};

export default mongoClientPromise;
