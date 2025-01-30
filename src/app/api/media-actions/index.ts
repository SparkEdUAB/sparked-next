import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { BSON } from 'mongodb';
import { HttpStatusCode } from 'axios';

export async function getMediaReactionCounts_(request: Request) {
  const { searchParams } = new URL(request.url);
  const mediaId = searchParams.get('mediaId') as string;

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

    const [reactionCounts] = await db
      .collection(dbCollections.media_reactions.name)
      .aggregate([
        { $match: { mediaId: mediaObjectId } },
        {
          $group: {
            _id: null,
            likes: {
              $sum: { $cond: [{ $eq: ['$type', 'like'] }, 1, 0] },
            },
            dislikes: {
              $sum: { $cond: [{ $eq: ['$type', 'dislike'] }, 1, 0] },
            },
          },
        },
      ])
      .toArray();

    return new Response(
      JSON.stringify({
        isError: false,
        likes: reactionCounts?.likes || 0,
        dislikes: reactionCounts?.dislikes || 0,
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
