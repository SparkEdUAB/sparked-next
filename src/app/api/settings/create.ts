import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { HttpStatusCode } from 'axios';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import SETTINGS_PROCESS_CODES from './processCodes';

export default async function createSetting_(request: Request, session?: Session) {
  const schema = zfd.formData({
    key: zfd.text().default('global_settings'),
    description: zfd.text().optional(),
    category: zfd.text().optional(),
    scope: zfd.text().optional(),
    setupType: zfd.text().optional(),
    uploadSetupType: zfd.text().optional(),
    institutions: zfd
      .json(
        z.array(
          z.object({
            name: z.string(),
            type: z.enum(['highSchool', 'college', 'other']).optional(),
            address: z.string().optional(),
            contactInfo: z.string().optional(),
            isActive: z.boolean().optional().default(true),
            isConfigured: z.boolean().optional().default(false),
          }),
        ),
      )
      .optional()
      .default([]),
  });

  const formBody = await request.json();
  const parsedData = schema.parse(formBody);

  try {
    const settingData = {
      ...parsedData,
      created_at: new Date(),
      updated_at: new Date(),
      // @ts-ignore
      created_by_id: session?.user?._id ? new BSON.ObjectId(session.user.id) : null,
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
