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
      return new Response(
        JSON.stringify({
          isError: true,
          code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
        }),
        { status: HttpStatusCode.InternalServerError },
      );
    }

    const users = await db
      .collection(dbCollections.users.name)
      .aggregate([
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
          $project: {
            _id: 1,
            email: 1,
            firstName: 1,
            lastName: 1,
            role: '$role_details.name',
            createdAt: 1,
            updatedAt: 1,
            phoneNumber: 1,
            isStudent: 1,
            institutionType: 1,
            schoolName: 1,
            grade: 1
          },
        },
        {
          $skip: skip || 0,
        },
        {
          $limit: limit || 10,
        },
      ])
      .toArray();

    return new Response(
      JSON.stringify({
        isError: false,
        users,
      }),
      { status: HttpStatusCode.Ok },
    );
  } catch {
    return new Response(
      JSON.stringify({
        isError: true,
        code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
      }),
      { status: HttpStatusCode.InternalServerError },
    );
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

    // Fixed query: Use aggregate directly instead of chaining after find
    const users = await db
      .collection(dbCollections.users.name)
      .aggregate([
        {
          // First stage: match documents based on search criteria
          $match: {
            $or: [
              { firstName: { $regex: regexPattern } },
              { lastName: { $regex: regexPattern } },
              { email: { $regex: regexPattern } },
            ],
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
          $project: {
            _id: 1,
            email: 1,
            firstName: 1,
            lastName: 1,
            role: '$role_details.name',
            createdAt: 1,
            updatedAt: 1,
            phoneNumber: 1,
            isStudent: 1,
            institutionType: 1,
            schoolName: 1,
            grade: 1
          },
        },
        {
          $skip: skip || 0,
        },
        {
          $limit: limit || 10,
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

export async function findUserByEmail_(request: any) {
  const schema = zfd.formData({
    email: zfd.text(),
  });
  const params = request.nextUrl.searchParams;

  const { email } = schema.parse(params);

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
    
    // Create case-insensitive regex pattern for email
    const regexPattern = new RegExp(`^${email.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i');

    const user = await db
      .collection(dbCollections.users.name)
      .aggregate([
        {
          // Match the exact email (case insensitive)
          $match: {
            email: { $regex: regexPattern }
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
          $project: {
            _id: 1,
            email: 1,
            firstName: 1,
            lastName: 1,
            role: '$role_details.name',
            createdAt: 1,
            updatedAt: 1,
            phoneNumber: 1,
            isStudent: 1,
            institutionType: 1,
            schoolName: 1,
            grade: 1
          },
        },
        {
          $limit: 1, // Ensure we only get one result
        },
      ])
      .toArray();

    const response = {
      isError: false,
      user: user.length > 0 ? user[0] : null,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch (error) {
    console.error('Error finding user by email:', error);
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
