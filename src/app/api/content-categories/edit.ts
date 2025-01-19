import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { HttpStatusCode } from 'axios';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as CATEGORIES_PROCESS_CODES } from './processCodes';
import { EDIT_CONTENT_CATEGORY_SCHEMA } from './schema';

export default async function editContentCategory_(request: Request, session?: Session) {
  const schema = EDIT_CONTENT_CATEGORY_SCHEMA;

  const formBody = await request.json();

  const { name, description, contentCategoryId } = schema.parse(formBody);

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

    const regexPattern = new RegExp(`^\\s*${name}\\s*$`, 'i');

    const duplicateCategory = await db.collection(dbCollections.content_categories.name).findOne(
      {
        name: { $regex: regexPattern },
        _id: { $ne: new BSON.ObjectId(contentCategoryId) },
      },
      {
        projection: {
          _id: 1,
        },
      },
    );

    if (duplicateCategory) {
      const response = {
        isError: true,
        code: CATEGORIES_PROCESS_CODES.CATEGORY_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    const query = {
      _id: new BSON.ObjectId(contentCategoryId),
    };

    const updateQuery = {
      name,
      description,
      updated_at: new Date(),
      //@ts-ignore
      updated_by_id: new BSON.ObjectId(session?.user?.id),
    };

    await db.collection(dbCollections.content_categories.name).updateOne(query, {
      $set: updateQuery,
    });

    const response = {
      isError: false,
      code: CATEGORIES_PROCESS_CODES.CATEGORY_EDITED,
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
