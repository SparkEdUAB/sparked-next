import { BSON } from 'mongodb';
import { dbClient } from '../../lib/db';
import { dbCollections } from '../../lib/db/collections';
import { HttpStatusCode } from 'axios';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('mediaId');

    if (!mediaId) {
      return new Response(
        JSON.stringify({
          isError: true,
          message: 'Media ID is required',
        }),
        { status: HttpStatusCode.BadRequest },
      );
    }

    const db = await dbClient();
    if (!db) {
      return new Response(
        JSON.stringify({
          isError: true,
          message: 'Database connection failed',
        }),
        { status: HttpStatusCode.InternalServerError },
      );
    }

    const viewCount = await db
      .collection(dbCollections.page_views.name)
      .countDocuments({ mediaId: new BSON.ObjectId(mediaId) });

    return new Response(
      JSON.stringify({
        isError: false,
        viewCount,
      }),
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        isError: true,
        message: 'Failed to fetch view count',
      }),
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
