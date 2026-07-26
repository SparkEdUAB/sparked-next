import { dbCollections } from '../collections';
import { Db } from 'mongodb';

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

export async function countMissingDefaultRoles(db: Db) {
  const existingRoles = await db
    .collection(dbCollections.user_roles.name)
    .find({ name: { $in: DEFAULT_ROLES.map((role) => role.name) } }, { projection: { name: 1 } })
    .toArray();
  const existingNames = new Set(existingRoles.map((role) => role.name));

  return DEFAULT_ROLES.filter((role) => !existingNames.has(role.name)).length;
}

export async function addDefaultRoles(db: Db) {
  const existingRoles = await db
    .collection(dbCollections.user_roles.name)
    .find({ name: { $in: DEFAULT_ROLES.map((role) => role.name) } }, { projection: { name: 1 } })
    .toArray();
  const existingNames = new Set(existingRoles.map((role) => role.name));
  const missingRoles = DEFAULT_ROLES.filter((role) => !existingNames.has(role.name));

  if (missingRoles.length) {
    const now = new Date();
    await db.collection(dbCollections.user_roles.name).insertMany(
      missingRoles.map((role) => ({ ...role, created_at: now, updated_at: now })),
      { ordered: false },
    );
  }

  return { insertedRoles: missingRoles.length };
}
