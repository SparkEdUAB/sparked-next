import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { z } from 'zod';
import { dbClient } from '../../lib/db';
import { dbCollections } from '../../lib/db/collections';
import { BSON } from 'mongodb';
import { HttpStatusCode } from 'axios';

export default async function fetchInstitutionUsers_(request: Request) {
  const url = new URL(request.url);
  const institutionIdParam = url.searchParams.get('institutionId');
  const limitParam = url.searchParams.get('limit');
  const skipParam = url.searchParams.get('skip');

  const schema = z.object({
    institutionId: z.string(),
    limit: z.number().optional().default(10),
    skip: z.number().optional().default(0),
  });

  try {
    let institutionId: string;
    let limit: number;
    let skip: number;

    // Handle both GET (query params) and POST (JSON body) requests
    if (institutionIdParam) {
      // GET request with query parameters
      const result = schema.parse({
        institutionId: institutionIdParam,
        limit: limitParam ? parseInt(limitParam) : 10,
        skip: skipParam ? parseInt(skipParam) : 0,
      });
      institutionId = result.institutionId;
      limit = result.limit;
      skip = result.skip;
    } else {
      // POST request with JSON body
      const formBody = await request.json();
      const result = schema.parse(formBody);
      institutionId = result.institutionId;
      limit = result.limit;
      skip = result.skip;
    }

    // Validate institution ID
    if (!BSON.ObjectId.isValid(institutionId)) {
      const response = {
        isError: true,
        code: 'INVALID_INSTITUTION_ID',
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

    // Fetch users with this institution_id
    const users = await db
      .collection(dbCollections.users.name)
      .aggregate([
        {
          $match: {
            institution_id: new BSON.ObjectId(institutionId),
          },
        },
        {
          $lookup: {
            from: dbCollections.user_role_mappings.name,
            localField: '_id',
            foreignField: 'user_id',
            as: 'role_mapping',
          },
        },
        {
          $unwind: {
            path: '$role_mapping',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: dbCollections.user_roles.name,
            localField: 'role_mapping.role_id',
            foreignField: '_id',
            as: 'role_details',
          },
        },
        {
          $unwind: {
            path: '$role_details',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: dbCollections.institutions.name,
            localField: 'institution_id',
            foreignField: '_id',
            as: 'institution',
          },
        },
        {
          $unwind: {
            path: '$institution',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            email: 1,
            firstName: 1,
            lastName: 1,
            role: '$role_details.name',
            phoneNumber: 1,
            isStudent: 1,
            institutionType: 1,
            schoolName: 1,
            grade: 1,
            institution_id: 1,
            institutionName: '$institution.name',
            created_at: 1,
            updated_at: 1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ])
      .toArray();

    const response = {
      isError: false,
      users,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch (error) {
    console.error('Error fetching institution users:', error);
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
