import { dbClient } from '../';
import { dbCollections } from '../collections';

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

export async function addDefaultRoles() {
  const db = await dbClient();
  if (!db) return;

  for (const role of DEFAULT_ROLES) {
    const exists = await db.collection(dbCollections.user_roles.name).findOne({ name: role.name });
    if (!exists) {
      await db.collection(dbCollections.user_roles.name).insertOne({
        ...role,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }
}
