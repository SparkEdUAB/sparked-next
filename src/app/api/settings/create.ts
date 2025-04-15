import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { HttpStatusCode } from 'axios';
import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { validateCollectionData } from '../lib/db/schemas';
import SETTINGS_PROCESS_CODES from './processCodes';

export default async function createSetting_(request: Request, session?: Session) {
  const schema = zfd.formData({
    key: zfd.text(),
    value: zfd.text(),
    description: zfd.text().optional(),
    category: zfd.text().optional(),
    scope: zfd.text().optional(),
    orgName: zfd.text().optional(),
    setupType: zfd.text().optional(),
  });

  const formBody = await request.json();
  const parsedData = schema.parse(formBody);

  try {
    let valueField;
    try {
      valueField = JSON.parse(parsedData.value);
    } catch {
      valueField = parsedData.value;
    }

    const settingData = {
      ...parsedData,
      value: valueField,
      created_at: new Date(),
      updated_at: new Date(),
      // @ts-ignore
      created_by_id: session?.user?.id ? new BSON.ObjectId(session.user.id) : null,
    };

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
    if (existingSetting) {
      const response = {
        isError: true,
        code: SETTINGS_PROCESS_CODES.SETTINGS_EXISTS,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    // const preparedData = prepareDataForValidation(settingData);
    const validatedData = validateCollectionData(dbCollections.settings.name, settingData);
    if (!validatedData._id) {
      return new Response(
        JSON.stringify({
          isError: true,
          code: 'VALIDATION_ERROR',
          message: 'VALIDATION_ERROR',
        }),
        {
          status: HttpStatusCode.InternalServerError,
        },
      );
    }

    await db.collection(dbCollections.settings.name).insertOne(settingData);

    const response = {
      isError: false,
      code: SETTINGS_PROCESS_CODES.SETTINGS_CREATED,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Created,
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
