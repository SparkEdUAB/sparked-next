import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as PAGE_LINK_PROCESS_CODES } from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function createMediaView_(request: Request) {
  const schema = zfd.formData({
    mediaId: zfd.text(),
  });

  const formBody = await request.json();
  const { mediaId } = schema.parse(formBody);

  try {
    const db = await dbClient();

    if (!db) {
      return new Response(
        JSON.stringify({
          isError: true,
          code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
        }),
        { status: HttpStatusCode.InternalServerError },
      );
    }

    const mediaObjectId = new BSON.ObjectId(mediaId);

    // Upsert view record
    await db.collection(dbCollections.page_views.name).updateOne(
      { mediaId: mediaObjectId },
      {
        $inc: { viewCount: 1 },
        $setOnInsert: { created_at: new Date() },
      },
      { upsert: true },
    );

    return new Response(
      JSON.stringify({
        isError: false,
        code: PAGE_LINK_PROCESS_CODES.MEDIA_VIEW,
      }),
      { status: HttpStatusCode.Ok },
    );
  } catch {
    return new Response(
      JSON.stringify({
        isError: true,
        code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
      }),
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
