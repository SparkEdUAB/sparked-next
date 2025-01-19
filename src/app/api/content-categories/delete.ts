import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { HttpStatusCode } from 'axios';
import { BSON } from 'mongodb';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { DELETE_CONTENT_CATEGORIES_BY_ID_SCHEMA } from './schema';

export async function deleteContentCategoriesById_(request: Request) {
  const schema = DELETE_CONTENT_CATEGORIES_BY_ID_SCHEMA;
  const formBody = await request.json();

  const { contentCategoryIds } = schema.parse(formBody);

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

    const results = await db.collection(dbCollections.content_categories.name).deleteMany({
      _id: {
        $in: contentCategoryIds.map((i) => new BSON.ObjectId(i)),
      },
    });

    const response = {
      isError: false,
      results,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
