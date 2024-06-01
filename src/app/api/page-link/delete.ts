import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as PAGE_PROCESS_CODES } from './processCodes';

export default async function deletePageLink_(request: Request, session?: Session) {
  const schema = zfd.formData({
    pageLinkIds: zfd.repeatableOfType(zfd.text()),
  });

  const formBody = await request.json();

  const { pageLinkIds } = schema.parse(formBody);

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

    const results = await db.collection(dbCollections.page_links.name).deleteMany({
      _id: {
        $in: pageLinkIds.map((i) => new BSON.ObjectId(i)),
      },
    });

    const response = {
      isError: false,
      code: PAGE_PROCESS_CODES.PAGE_DELETED,
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
