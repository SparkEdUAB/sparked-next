import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { HttpStatusCode } from 'axios';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';

export default async function fetchSettings_() {
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

    const settings = await db.collection(dbCollections.settings.name).findOne({ key: 'global_settings' });

    if (!settings) {
      const response = {
        isError: false,
        settings: {
          key: 'global_settings',
          value: {},
          isActive: true,
          scope: 'global',
          institutions: [],
          version: 1,
        },
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.Ok,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }

    const response = {
      isError: false,
      settings,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
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

export async function fetchInstitutions_(request: any) {
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

    const settings = await db
      .collection(dbCollections.settings.name)
      .findOne({ key: 'global_settings' }, { projection: { institutions: 1 } });

    const institutions = settings?.institutions || [];

    const response = {
      isError: false,
      institutions,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
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
