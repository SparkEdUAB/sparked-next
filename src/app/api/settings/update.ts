import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { HttpStatusCode } from 'axios';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { prepareDataForValidation, validateCollectionData } from '../lib/db/schemas';
import SETTINGS_PROCESS_CODES from './processCodes';

export default async function updateSettings_(request: Request, session?: Session) {
  try {
    const formBody = await request.json();

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

    const existingSettings = await db.collection(dbCollections.settings.name).findOne({ key: 'global_settings' });

    const updateData = {
      ...formBody,
      key: 'global_settings', // Ensure key is always global_settings
      updated_at: new Date(),
      lastUpdated: new Date(),
      // @ts-ignore
      updated_by_id: session?.user?._id ? new BSON.ObjectId(session.user.id) : null,
    };

    if (!existingSettings) {
      const newSettings = {
        ...updateData,
        created_at: new Date(),
        // @ts-ignore
        created_by_id: session?.user?._id ? new BSON.ObjectId(session.user.id) : null,
        isActive: true,
        scope: 'global',
        version: 1,
      };

      const preparedData = prepareDataForValidation(newSettings);
      const validatedData = validateCollectionData(dbCollections.settings.name, preparedData);

      await db.collection(dbCollections.settings.name).insertOne(newSettings);

      const response = {
        isError: false,
        code: SETTINGS_PROCESS_CODES.SETTINGS_CREATED,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.Created,
      });
    }

    const mergedData = { ...existingSettings, ...updateData };
    const preparedData = prepareDataForValidation(mergedData);
    const validatedData = validateCollectionData(dbCollections.settings.name, preparedData);

    await db.collection(dbCollections.settings.name).updateOne({ key: 'global_settings' }, { $set: updateData });

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
