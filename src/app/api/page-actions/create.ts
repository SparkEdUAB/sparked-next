import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import PAGE_ACTIONS_PROCESS_CODES from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function createPageAction_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
    actionKey: zfd.text(),
    label: zfd.text(),
  });

  const formBody = await request.json();

  const { name, description, label, actionKey } = schema.parse(formBody);

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

    const duplicatePageAction = await db.collection(dbCollections.page_actions.name).findOne(
      {
        $or: [{ name: { $regex: regexPattern } }, { action_key: actionKey }],
      },
      {
        projection: {
          _id: 1,
        },
      },
    );

    if (duplicatePageAction) {
      const response = {
        isError: true,
        code: PAGE_ACTIONS_PROCESS_CODES.PAGE_ACTION_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    await db.collection(dbCollections.page_actions.name).insertOne({
      name,
      description,
      created_at: new Date(),
      updated_at: new Date(),
      label,
      action_key: actionKey,
      //@ts-ignore
      created_by_id: new BSON.ObjectId(session?.user?._id),
    });

    const response = {
      isError: false,
      code: PAGE_ACTIONS_PROCESS_CODES.PAGE_ACTION_CREATED,
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
