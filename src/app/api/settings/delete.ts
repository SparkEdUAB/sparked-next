import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { HttpStatusCode } from 'axios';
import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import SETTINGS_PROCESS_CODES from './processCodes';

export default async function deleteSetting_(request: Request, session?: Session) {
  const schema = zfd.formData({
    key: zfd.text(),
  });

  const formBody = await request.json();
  const { key } = schema.parse(formBody);

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

    // Check if setting exists
    const existingSetting = await db.collection(dbCollections.settings.name).findOne({ key });
    if (!existingSetting) {
      const response = {
        isError: true,
        code: SETTINGS_PROCESS_CODES.SETTINGS_NOT_FOUND,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    // Delete the setting
    await db.collection(dbCollections.settings.name).deleteOne({ key });

    const response = {
      isError: false,
      code: SETTINGS_PROCESS_CODES.SETTINGS_DELETED,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
