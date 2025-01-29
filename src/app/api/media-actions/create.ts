import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as PAGE_LINK_PROCESS_CODES } from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function createMediaView(request: Request, session?: Session) {
  const schema = zfd.formData({
    mediaId: zfd.text(),
  });

  const formBody = await request.json();
  const { mediaId } = schema.parse(formBody);

  console.log(session);
  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.InternalServerError,
      });
    }

    // Check if user has already viewed this media
    const existingView = await db.collection(dbCollections.page_views.name).findOne({
      mediaId: new BSON.ObjectId(mediaId),
      userId: session?.user?.id,
    });

    if (!existingView) {
      // Add new view record
      await db.collection(dbCollections.page_views.name).insertOne({
        mediaId: new BSON.ObjectId(mediaId),
        userId: session?.user?.id,
        created_at: new Date(),
      });

      // Increment view count in media_content collection
      await db
        .collection(dbCollections.media_content.name)
        .updateOne({ _id: new BSON.ObjectId(mediaId) }, { $inc: { viewCount: 1 } });
    }

    // Get updated view count
    const mediaContent = await db
      .collection(dbCollections.media_content.name)
      .findOne({ _id: new BSON.ObjectId(mediaId) }, { projection: { viewCount: 1 } });

    const response = {
      isError: false,
      code: PAGE_LINK_PROCESS_CODES.MEDIA_VIEW,
      viewCount: mediaContent?.viewCount || 0,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
