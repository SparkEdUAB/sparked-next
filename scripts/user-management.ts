import { MongoClient } from 'mongodb';
import bcryptjs from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI as string;
const DB_NAME = process.env.DB_NAME || 'sparked';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function connectToDatabase() {
  const client = await MongoClient.connect(MONGODB_URI);
  return client.db(DB_NAME);
}

async function updateUserRole(email: string, newRole: string) {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');

  const result = await usersCollection.updateOne(
    { email: email.toLowerCase() },
    { $set: { role: newRole } }
  );

  if (result.matchedCount === 0) {
    console.error(`User with email ${email} not found`);
    process.exit(1);
  }

  console.log(`Successfully updated role to ${newRole} for user ${email}`);
  process.exit(0);
}

async function createUser(email: string, password: string) {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');

  // Check if user already exists
  const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    console.error(`User with email ${email} already exists`);
    process.exit(1);
  }

  // Hash password
  const hashedPassword = await bcryptjs.hash(password, 12);

  // Create user with default role 'Student'
  const result = await usersCollection.insertOne({
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'Student',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  console.log(`Successfully created user ${email} with role Student`);
  process.exit(0);
}

// Parse command line arguments
const [,, command, email, arg2] = process.argv;

if (!command || !email) {
  console.error('Usage:\n  npm run script user-management.ts update-role <email> <newRole>\n  npm run script user-management.ts create-user <email> <password>');
  process.exit(1);
}

// Execute appropriate command
if (command === 'update-role' && arg2) {
  updateUserRole(email, arg2).catch(console.error);
} else if (command === 'create-user' && arg2) {
  createUser(email, arg2).catch(console.error);
} else {
  console.error('Invalid command or missing arguments');
  process.exit(1);
}