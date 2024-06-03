import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as PAGE_LINK_PROCESS_CODES } from './processCodes';

export default async function createPageLink_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
    pageLink: zfd.text(),
  });

  const formBody = await request.json();

  const { name, description, pageLink } = schema.parse(formBody);

  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
      };
      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }
    const regexPattern = new RegExp(`^\\s*${name}\\s*$`, 'i');

    const pageLinkData = await db.collection(dbCollections.page_links.name).findOne(
      {
        name: { $regex: regexPattern },
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
        status: 200,
      });
    }

    await db.collection(dbCollections.page_links.name).insertOne({
      name,
      description,
      link: pageLink,
      created_at: new Date(),
      updated_at: new Date(),
      //@ts-ignore
      created_by_id: new BSON.ObjectId(session?.user?.id),
    });

    const response = {
      isError: false,
      code: PAGE_LINK_PROCESS_CODES.PAGE_CREATED,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}
