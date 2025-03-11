const { dbClient } = require('../src/app/api/lib/db');
const { dbCollections } = require('../src/app/api/lib/db/collections');

const DEFAULT_ROLES = [
  {
    name: 'Admin',
    description: 'Administrator with full access',
  },
  {
    name: 'Content Manager',
    description: 'Manager with full content management access',
  },
  {
    name: 'Editor',
    description: 'Editor with limited content management access',
  },
  {
    name: 'student',
    description: 'Student with limited access',
  },
];

async function addDefaultRoles() {
  console.log('Starting to add default roles...');
  const db = await dbClient();
  if (!db) {
    console.error('Failed to connect to database');
    return;
  }

  for (const role of DEFAULT_ROLES) {
    const exists = await db.collection(dbCollections.user_roles.name).findOne({ name: role.name });
    if (!exists) {
      await db.collection(dbCollections.user_roles.name).insertOne({
        ...role,
        created_at: new Date(),
        updated_at: new Date(),
      });
      console.log(`Added role: ${role.name}`);
    } else {
      console.log(`Role already exists: ${role.name}`);
    }
  }
  
  console.log('Default roles setup completed');
  process.exit(0);
}

// Execute the function
addDefaultRoles().catch(error => {
  console.error('Error adding default roles:', error);
  process.exit(1);
});