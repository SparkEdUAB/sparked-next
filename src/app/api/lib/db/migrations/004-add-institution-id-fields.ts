import { Db } from 'mongodb';

export async function up(db: Db): Promise<void> {
  for (const col of ['programs', 'courses', 'units', 'subjects', 'grades', 'topics', 'media_content', 'users']) {
    await db.collection(col).createIndex({ institution_id: 1 });
  }
}
export const name = '004-add-institution-id-fields';
