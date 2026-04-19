import { Db } from 'mongodb';

export async function up(db: Db): Promise<void> {
  try {
    await db.createCollection('institution_memberships');
  } catch (err: any) {
    if (err?.code !== 48) throw err;
  }
  await db.collection('institution_memberships').createIndex(
    { user_id: 1, institution_id: 1 },
    { unique: true }
  );
  await db.collection('institution_memberships').createIndex({ institution_id: 1 });

  try {
    await db.createCollection('institution_invites');
  } catch (err: any) {
    if (err?.code !== 48) throw err;
  }
  await db.collection('institution_invites').createIndex({ token: 1 }, { unique: true });
  await db.collection('institution_invites').createIndex({ email: 1, institution_id: 1 });
}
export const name = '005-add-institution-collections';
