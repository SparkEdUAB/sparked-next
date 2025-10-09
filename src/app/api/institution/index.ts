import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { z } from 'zod';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { p_fetchInstitutionsWithCreator } from './pipelines';
import { BSON } from 'mongodb';
import { HttpStatusCode } from 'axios';

export default async function fetchInstitutions_(request: Request) {
  const schema = z.object({
    limit: z.number(),
    skip: z.number(),
  });
    console.log("institi:");
  
  try {
    const formBody = await request.json();
    const { limit, skip } = schema.parse(formBody);

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
    console.log("institi:", institutions);
    

    const response = {
      isError: false,
      institutions,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch (error) {
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
  const schema = z.object({
    institutionId: z.string(),
  });
  
  try {
    const formBody = await request.json();
    const { institutionId } = schema.parse(formBody);

    // Validate ObjectId format
    if (!BSON.ObjectId.isValid(institutionId)) {
      const response = {
        isError: true,
        code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }
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
  } catch (error) {
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
  const schema = z.object({
    limit: z.number().optional(),
    search: z.string().optional(),
  });
  
  try {
    const formBody = await request.json();
    const { limit = 50, search } = schema.parse(formBody);
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
    const searchFilter: any = { is_verified: false };
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
console.log("institutions:", institutions);

    const response = {
      isError: false,
      institutions,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch (error) {
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
  const schema = z.object({
    institutionIds: z.array(z.string()),
  });
  
  try {
    const formBody = await request.json();
    const { institutionIds } = schema.parse(formBody);

    // Validate all ObjectIds
    const invalidIds = institutionIds.filter(id => !BSON.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      const response = {
        isError: true,
        code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }
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

    const objectIds = institutionIds.map((id: string) => new BSON.ObjectId(id));

    await db.collection(dbCollections.institutions.name).deleteMany({
      _id: { $in: objectIds },
    });

    const response = {
      isError: false,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch (error) {
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
  const schema = z.object({
    searchQuery: z.string(),
    limit: z.number().optional(),
  });
  
  try {
    const formBody = await request.json();
    const { searchQuery, limit = 20 } = schema.parse(formBody);
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
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}