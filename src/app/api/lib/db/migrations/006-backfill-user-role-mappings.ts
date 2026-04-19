import { Db } from 'mongodb';
import { dbCollections } from '../collections';

export const name = '006-backfill-user-role-mappings';

export async function up(db: Db): Promise<void> {
  const users = await db.collection(dbCollections.users.name).find({}, { projection: { _id: 1, role: 1 } }).toArray();

  const roles = await db.collection(dbCollections.user_roles.name).find({}).toArray();
  const roleByName = new Map(roles.map((r) => [r.name.toLowerCase(), r]));

  const studentRole = roleByName.get('student');
  if (!studentRole) throw new Error('[006] student role not found in user_roles — run migration 001 first');

  for (const user of users) {
    const existing = await db
      .collection(dbCollections.user_role_mappings.name)
      .findOne({ user_id: user._id });

    if (existing) continue;

    const roleName = typeof user.role === 'string' ? user.role.toLowerCase() : 'student';
    const matchedRole = roleByName.get(roleName) ?? studentRole;

    await db.collection(dbCollections.user_role_mappings.name).insertOne({
      user_id: user._id,
      role_id: matchedRole._id,
      created_at: new Date(),
    });
  }
}
