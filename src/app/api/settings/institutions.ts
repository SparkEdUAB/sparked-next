import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { HttpStatusCode } from 'axios';
import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import SETTINGS_PROCESS_CODES from './processCodes';

export async function addInstitution_(request: Request, session?: Session) {
  try {
    const formBody = await request.json();

    const schema = zfd.formData({
      name: zfd.text(),
      type: zfd.text().optional(),
      address: zfd.text().optional(),
      contactInfo: zfd.text().optional(),
    });

    const institutionData = schema.parse(formBody);

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

    const institutionId = new BSON.ObjectId().toString();

    const newInstitution = {
      _id: institutionId,
      name: institutionData.name,
      type: institutionData.type || 'other',
      address: institutionData.address || '',
      contactInfo: institutionData.contactInfo || '',
      isActive: true,
      isConfigured: false,
    };

    await db.collection(dbCollections.settings.name).updateOne(
      { key: 'global_settings' },
      {
        // @ts-expect-error
        $push: { institutions: newInstitution },
        $set: {
          updated_at: new Date(),
          lastUpdated: new Date(),
          // @ts-ignore
          updated_by_id: session?.user?._id ? new BSON.ObjectId(session.user.id) : null,
        },
      },
      { upsert: true },
    );

    const response = {
      isError: false,
      code: SETTINGS_PROCESS_CODES.INSTITUTION_ADDED,
      institutionId,
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

export async function updateInstitution_(request: Request, session?: Session) {
  try {
    const formBody = await request.json();

    const schema = zfd.formData({
      _id: zfd.text(),
      name: zfd.text().optional(),
      type: zfd.text().optional(),
      address: zfd.text().optional(),
      contactInfo: zfd.text().optional(),
    });

    const institutionData = schema.parse(formBody);

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

    const updateFields = {} as Record<string, any>;
    for (const [key, value] of Object.entries(institutionData)) {
      if (key !== 'id' && value !== undefined) {
        (updateFields as Record<string, any>)[`institutions.$.${key}`] = value;
      }
    }

    updateFields['updated_at'] = new Date();
    updateFields['last_updated_at'] = new Date();
    // @ts-ignore
    updateFields['updated_by_id'] = session?.user?._id ? new BSON.ObjectId(session.user.id) : null;

    const result = await db.collection(dbCollections.settings.name).updateOne(
      {
        key: 'global_settings',
        'institutions._id': institutionData._id,
      },
      { $set: updateFields },
    );

    if (result.matchedCount === 0) {
      const response = {
        isError: true,
        code: SETTINGS_PROCESS_CODES.INSTITUTION_NOT_FOUND,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    const response = {
      isError: false,
      code: SETTINGS_PROCESS_CODES.INSTITUTION_UPDATED,
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

export async function removeInstitution_(request: Request, session?: Session) {
  try {
    const formBody = await request.json();

    const schema = zfd.formData({
      id: zfd.text(),
    });

    const { id } = schema.parse(formBody);

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

    const result = await db.collection(dbCollections.settings.name).updateOne(
      { key: 'global_settings' },
      {
        // @ts-expect-error
        $pull: { institutions: { _id: id } },
        $set: {
          updated_at: new Date(),
          lastUpdated: new Date(),
          // @ts-ignore
          updated_by_id: session?.user?._id ? new BSON.ObjectId(session.user.id) : null,
        },
      },
    );

    if (result.modifiedCount === 0) {
      const response = {
        isError: true,
        code: SETTINGS_PROCESS_CODES.INSTITUTION_NOT_FOUND,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    const response = {
      isError: false,
      code: SETTINGS_PROCESS_CODES.INSTITUTION_REMOVED,
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
