import { Db } from 'mongodb';

export async function up(db: Db): Promise<void> {
  // media_content
  await db.collection('media_content').createIndex({ grade_id: 1 });
  await db.collection('media_content').createIndex({ subject_id: 1 });
  await db.collection('media_content').createIndex({ unit_id: 1 });
  await db.collection('media_content').createIndex({ topic_id: 1 });
  await db.collection('media_content').createIndex({ name: 'text' });

  // users — WARNING: will fail if duplicate emails exist in the collection.
  // Before running on prod, verify: db.users.aggregate([{$group:{_id:"$email",n:{$sum:1}}},{$match:{n:{$gt:1}}}])
  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  // user_role_mappings (DB name is 'user-role-mappings' with hyphen)
  // WARNING: will fail if duplicate user_id values exist in the collection.
  await db.collection('user-role-mappings').createIndex({ user_id: 1 }, { unique: true });

  // media_reactions
  await db.collection('media_reactions').createIndex(
    { media_content_id: 1, user_id: 1 },
    { unique: true }
  );
}
export const name = '002-add-indexes';
