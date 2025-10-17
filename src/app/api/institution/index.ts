import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { z } from 'zod';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { p_fetchInstitutionsWithCreator } from './pipelines';
import { BSON } from 'mongodb';
import { HttpStatusCode } from 'axios';

export default async function fetchInstitutions_(request: Request) {
  const url = new URL(request.url);
  const limitParam = url.searchParams.get('limit');
  const skipParam = url.searchParams.get('skip');
  
  const schema = z.object({
    limit: z.number(),
    skip: z.number(),
  });
  
  try {
    let limit: number;
    let skip: number;

    // Handle both GET (query params) and POST (JSON body) requests
    if (limitParam !== null && skipParam !== null) {
      // GET request with query parameters
      const result = schema.parse({
        limit: parseInt(limitParam),
        skip: parseInt(skipParam)
      });
      limit = result.limit;
      skip = result.skip;
    } else {
      // POST request with JSON body
      const formBody = await request.json();
      const result = schema.parse(formBody);
      limit = result.limit;
      skip = result.skip;
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
  } catch  {
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
  } catch  {
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
  } catch  {
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
  } catch  {
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
  const url = new URL(request.url);
  const nameParam = url.searchParams.get('name');
  const limitParam = url.searchParams.get('limit');
  
  const schema = z.object({
    searchQuery: z.string(),
    limit: z.number().optional(),
  });
  
  try {
    let searchQuery: string;
    let limit: number;

    // Handle both GET (query params) and POST (JSON body) requests
    if (nameParam !== null) {
      // GET request with query parameters
      searchQuery = nameParam;
      limit = limitParam ? parseInt(limitParam) : 20;
    } else {
      // POST request with JSON body
      const formBody = await request.json();
      const result = schema.parse(formBody);
      searchQuery = result.searchQuery;
      limit = result.limit || 20;
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
  } catch  {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}