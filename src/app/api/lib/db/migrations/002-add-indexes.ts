import { Db } from 'mongodb';

export async function up(db: Db): Promise<void> {
  // media_content
  await db.collection('media_content').createIndex({ grade_id: 1 });
  await db.collection('media_content').createIndex({ subject_id: 1 });
  await db.collection('media_content').createIndex({ unit_id: 1 });
  await db.collection('media_content').createIndex({ topic_id: 1 });
  await db.collection('media_content').createIndex({ name: 'text' });

  // users
  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  // user_role_mappings (DB name is 'user-role-mappings' with hyphen)
  await db.collection('user-role-mappings').createIndex({ user_id: 1 }, { unique: true });

  // media_reactions
  await db.collection('media_reactions').createIndex(
    { media_content_id: 1, user_id: 1 },
    { unique: true }
  );
}
export const name = '002-add-indexes';
