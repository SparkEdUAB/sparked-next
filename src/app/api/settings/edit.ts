import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { HttpStatusCode } from 'axios';
import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { validateCollectionData, prepareDataForValidation } from '../lib/db/schemas';
import SETTINGS_PROCESS_CODES from './processCodes';

export default async function editSetting_(request: Request, session?: Session) {
  const schema = zfd.formData({
    key: zfd.text().optional().default('global_settings'),
    category: zfd.text().optional(),
    scope: zfd.text().optional(),
    uploadSetup: zfd.text().optional().default('s3'),
  });

  const formBody = await request.json();
  const parsedData = schema.parse(formBody);

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

    const existingSetting = await db.collection(dbCollections.settings.name).findOne({ key: parsedData.key });
    if (!existingSetting) {
      const response = {
        isError: true,
        code: SETTINGS_PROCESS_CODES.SETTINGS_NOT_FOUND,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    const updateData: any = {
      updated_at: new Date(),
      // @ts-ignore
      updated_by_id: session?.user?._id ? new BSON.ObjectId(session.user.id) : null,
    };

    if (parsedData.category) updateData.category = parsedData.category;
    if (parsedData.scope) updateData.scope = parsedData.scope;
    if (parsedData.uploadSetup) updateData.uploadSetup = parsedData.uploadSetup;

    const mergedData = { ...existingSetting, ...updateData };
    const preparedData = prepareDataForValidation(mergedData);
    const validatedData = validateCollectionData(dbCollections.settings.name, preparedData);

    await db.collection(dbCollections.settings.name).updateOne({ key: parsedData.key }, { $set: updateData });

    const response = {
      isError: false,
      code: SETTINGS_PROCESS_CODES.SETTINGS_UPDATED,
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
