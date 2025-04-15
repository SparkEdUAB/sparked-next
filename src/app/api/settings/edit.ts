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
    key: zfd.text(),
    value: zfd.text().optional(),
    description: zfd.text().optional(),
    category: zfd.text().optional(),
    scope: zfd.text().optional(),
    orgName: zfd.text().optional(),
    setupType: zfd.text().optional(),
    isActive: zfd.text().optional(),
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
      updated_by_id: session?.user?.id ? new BSON.ObjectId(session.user.id) : null,
    };

    if (parsedData.description) updateData.description = parsedData.description;
    if (parsedData.category) updateData.category = parsedData.category;
    if (parsedData.scope) updateData.scope = parsedData.scope;
    if (parsedData.orgName) updateData.orgName = parsedData.orgName;
    if (parsedData.setupType) updateData.setupType = parsedData.setupType;
    if (parsedData.isActive !== undefined) updateData.isActive = parsedData.isActive === 'true';

    if (parsedData.value !== undefined) {
      try {
        updateData.value = JSON.parse(parsedData.value);
      } catch {
        updateData.value = parsedData.value;
      }
    }

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
