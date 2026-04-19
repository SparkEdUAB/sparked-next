import { Db } from 'mongodb';

export async function up(db: Db): Promise<void> {
  // Fix settings.upated_at → updated_at
  await db.collection('settings').updateMany(
    { upated_at: { $exists: true } },
    [{ $set: { updated_at: '$upated_at' } }, { $unset: 'upated_at' }]
  );

  // Fix courses.institutions_id → institution_id
  await db.collection('courses').updateMany(
    { institutions_id: { $exists: true } },
    [{ $set: { institution_id: '$institutions_id' } }, { $unset: 'institutions_id' }]
  );
}
export const name = '003-fix-schema-typos';
