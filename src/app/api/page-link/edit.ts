import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as PAGE_LINK_PROCESS_CODES } from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function editPageLink_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    pageLinkId: zfd.text(),
    description: zfd.text(),
    pageLink: zfd.text(),
  });

  const formBody = await request.json();

  const { name, description, pageLink, pageLinkId } = schema.parse(formBody);

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

    const pageLinkData = await db.collection(dbCollections.page_links.name).findOne(
      {
        name: { $regex: regexPattern },
        _id: { $ne: new BSON.ObjectId(pageLinkId) },
      },
      {
        projection: {
          _id: 1,
        },
      },
    );

    if (pageLinkData) {
      const response = {
        isError: true,
        code: PAGE_LINK_PROCESS_CODES.PAGE_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    const query = {
      _id: new BSON.ObjectId(pageLinkId),
    };

    const updateQuery = {
      name,
      description,
      updated_at: new Date(),
      link: pageLink,
      //@ts-ignore
      updated_by_id: new BSON.ObjectId(session?.user?.id),
    };

    await db.collection(dbCollections.page_links.name).updateOne(query, {
      $set: updateQuery,
    });

    const response = {
      isError: false,
      code: PAGE_LINK_PROCESS_CODES.PAGE_EDITED,
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
