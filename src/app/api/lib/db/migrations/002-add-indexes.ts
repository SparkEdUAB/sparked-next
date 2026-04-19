import { Db } from 'mongodb';

async function deduplicateBefore(
  db: Db,
  collection: string,
  groupFields: Record<string, string>,
) {
  const group: Record<string, unknown> = { count: { $sum: 1 }, ids: { $push: '$_id' } };
  const matchKey: Record<string, string> = {};
  for (const [alias, field] of Object.entries(groupFields)) {
    group[alias] = { $first: `$${field}` };
    matchKey[alias] = `$${field}`;
  }

  const duplicates = await db.collection(collection).aggregate([
    { $group: { _id: matchKey, ids: { $push: '$_id' }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]).toArray();

  for (const dup of duplicates) {
    const [, ...toDelete] = dup.ids; // keep oldest, delete the rest
    await db.collection(collection).deleteMany({ _id: { $in: toDelete } });
    console.log(`[migrate:002] Removed ${toDelete.length} duplicate(s) from ${collection}`);
  }
}

export async function up(db: Db): Promise<void> {
  // media_content
  await db.collection('media_content').createIndex({ grade_id: 1 });
  await db.collection('media_content').createIndex({ subject_id: 1 });
  await db.collection('media_content').createIndex({ unit_id: 1 });
  await db.collection('media_content').createIndex({ topic_id: 1 });
  await db.collection('media_content').createIndex({ name: 'text' });

  // users — deduplicate by email first, then enforce uniqueness
  await deduplicateBefore(db, 'users', { email: 'email' });
  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  // user-role-mappings — deduplicate by user_id first, then enforce uniqueness
  await deduplicateBefore(db, 'user-role-mappings', { user_id: 'user_id' });
  await db.collection('user-role-mappings').createIndex({ user_id: 1 }, { unique: true });

  // media_reactions — deduplicate by compound key first, then enforce uniqueness
  await deduplicateBefore(db, 'media_reactions', { media_content_id: 'media_content_id', user_id: 'user_id' });
  await db.collection('media_reactions').createIndex(
    { media_content_id: 1, user_id: 1 },
    { unique: true },
  );
}
export const name = '002-add-indexes';
