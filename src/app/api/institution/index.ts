import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { p_fetchInstitutionsWithCreator } from './pipelines';
import { BSON } from 'mongodb';
import { HttpStatusCode } from 'axios';
import { z } from 'zod';

export default async function fetchInstitutions_(request: Request) {
  const schema = zfd.formData({
    limit: zfd.numeric(),
    skip: zfd.numeric(),
  });
  const formBody = await request.json();

  const { limit, skip } = schema.parse(formBody);

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

    const institutions = await db
      .collection(dbCollections.institutions.name)
      .aggregate(p_fetchInstitutionsWithCreator(limit, skip))
      .toArray();

    const response = {
      isError: false,
      institutions,
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

export async function fetchInstitution_(request: Request) {
  const schema = zfd.formData({
    institutionId: zfd.text(),
  });
  const formBody = await request.json();

  const { institutionId } = schema.parse(formBody);

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

    const institution = await db.collection(dbCollections.institutions.name).findOne({ 
      _id: new BSON.ObjectId(institutionId) 
    });

    const response = {
      isError: false,
      institution,
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

export async function fetchPublicInstitutions_(request: Request) {
  const schema = zfd.formData({
    limit: zfd.numeric().optional(),
    search: zfd.text().optional(),
  });
  const formBody = await request.json();

  const { limit = 50, search } = schema.parse(formBody);

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

    // Build search filter
    const searchFilter: any = { is_verified: true };
    if (search) {
      searchFilter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const institutions = await db
      .collection(dbCollections.institutions.name)
      .find(searchFilter)
      .limit(limit)
      .sort({ name: 1 })
      .toArray();

    const response = {
      isError: false,
      institutions,
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

export async function deleteInstitutions_(request: Request) {
  const schema = zfd.formData({
    institutionIds: z.array(zfd.text()),
  });
  const formBody = await request.json();

  const { institutionIds } = schema.parse(formBody);

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

    const objectIds = institutionIds.map((id) => new BSON.ObjectId(id));

    await db.collection(dbCollections.institutions.name).deleteMany({
      _id: { $in: objectIds },
    });

    const response = {
      isError: false,
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

export async function findInstitutionsByName_(request: Request) {
  const schema = zfd.formData({
    searchQuery: zfd.text(),
    limit: zfd.numeric().optional(),
  });
  const formBody = await request.json();

  const { searchQuery, limit = 20 } = schema.parse(formBody);

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

    const institutions = await db
      .collection(dbCollections.institutions.name)
      .find({
        name: { $regex: searchQuery, $options: 'i' },
      })
      .limit(limit)
      .toArray();

    const response = {
      isError: false,
      institutions,
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