import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { BSON } from 'mongodb';
import { HttpStatusCode } from 'axios';

export default async function fetchUsers_(request: any) {
  const schema = zfd.formData({
    limit: zfd.numeric().optional(),
    skip: zfd.numeric().optional(),
    withMetaData: zfd.text().default('true').optional(),
  });
  const params = request.nextUrl.searchParams;

  const { limit, skip } = schema.parse(params);
  //   const isWithMetaData = withMetaData == 'true';

  try {
    const db = await dbClient();
    if (!db) {
      return new Response(JSON.stringify({
        isError: true,
        code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
      }), { status: HttpStatusCode.InternalServerError });
    }

    const users = await db.collection(dbCollections.users.name)
      .aggregate([
        {
          $lookup: {
            from: dbCollections.user_role_mappings.name,
            localField: '_id',
            foreignField: 'user_id',
            as: 'role_mapping'
          }
        },
        {
          $unwind: {
            path: '$role_mapping',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: dbCollections.user_roles.name,
            localField: 'role_mapping.role_id',
            foreignField: '_id',
            as: 'role_details'
          }
        },
        {
          $unwind: {
            path: '$role_details',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            email: 1,
            firstName: 1,
            lastName: 1,
            role: '$role_details.name',
            createdAt: 1,
            updatedAt: 1
          }
        },
        {
          $skip: skip || 0
        },
        {
          $limit: limit || 10
        }
      ]).toArray();

    return new Response(JSON.stringify({
      isError: false,
      users,
    }), { status: HttpStatusCode.Ok });

  } catch (error) {
    return new Response(JSON.stringify({
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    }), { status: HttpStatusCode.InternalServerError });
  }
}

export async function findUserByName_(request: any) {
  const schema = zfd.formData({
    name: zfd.text(),
    skip: zfd.numeric().optional(),
    limit: zfd.numeric().optional(),
  });
  const params = request.nextUrl.searchParams;

  const { name, limit, skip } = schema.parse(params);

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
    const regexPattern = new RegExp(name, 'i');

    const users = await db
      .collection(dbCollections.users.name)
      .find(
        {
          $or: [
            { firstName: { $regex: regexPattern } },
            { lastName: { $regex: regexPattern } },
            { email: { $regex: regexPattern } },
          ],
        },
        { skip, limit },
      )
      .toArray();

    const response = {
      isError: false,
      users,
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

export async function deleteUsers_(request: Request) {
  const schema = zfd.formData({
    userIds: zfd.repeatableOfType(zfd.text()),
  });
  const formBody = await request.json();

  const { userIds } = schema.parse(formBody);

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

    const results = await db.collection(dbCollections.users.name).deleteMany({
      _id: {
        $in: userIds.map((i) => new BSON.ObjectId(i)),
      },
    });

    const response = {
      isError: false,
      results,
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
