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

export async function createMediaReaction_(request: Request) {
  const schema = zfd.formData({
    mediaId: zfd.text(),
    userEmail: zfd.text(),
    actionType: zfd.text(),
  });

  const formBody = await request.json();
  const { mediaId, userEmail, actionType } = schema.parse(formBody);

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

    // Find user by email
    const user = await db.collection(dbCollections.users.name).findOne({ email: userEmail });

    if (!user) {
      return new Response(
        JSON.stringify({
          isError: true,
          message: 'User not found',
        }),
        { status: HttpStatusCode.NotFound },
      );
    }

    const mediaObjectId = new BSON.ObjectId(mediaId);
    const userId = user._id;

    // Check if media exists
    const media = await db.collection(dbCollections.media_content.name).findOne({ _id: mediaObjectId });

    if (!media) {
      return new Response(
        JSON.stringify({
          isError: true,
          message: 'Can not like/dislike this content',
        }),
        { status: HttpStatusCode.NotFound },
      );
    }

    // Check existing reactions
    const existingReaction = await db.collection(dbCollections.media_reactions.name).findOne({
      mediaId: mediaObjectId,
      userId,
    });

    if (existingReaction) {
      if (existingReaction.type === actionType) {
        // Remove the reaction if it's the same type
        await db.collection(dbCollections.media_reactions.name).deleteOne({
          mediaId: mediaObjectId,
          userId,
        });

        return new Response(
          JSON.stringify({
            isError: false,
            message: 'Reaction removed',
            userReaction: null,
          }),
          { status: HttpStatusCode.Ok },
        );
      }
    }

    // Upsert the reaction
    await db.collection(dbCollections.media_reactions.name).updateOne(
      {
        mediaId: mediaObjectId,
        userId,
      },
      {
        $set: {
          type: actionType,
          updated_at: new Date(),
        },
        $setOnInsert: {
          created_at: new Date(),
        },
      },
      { upsert: true },
    );

    return new Response(
      JSON.stringify({
        isError: false,
        message: 'Reaction recorded',
        userReaction: actionType,
      }),
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        isError: true,
        code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
