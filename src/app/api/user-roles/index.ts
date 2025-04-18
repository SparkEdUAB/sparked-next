import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { Session } from 'next-auth';
import USER_ROLES_PROCESS_CODES from './processCodes';
import USERS_PROCESS_CODES from '../users/processCodes';
import { HttpStatusCode } from 'axios';

export default async function fetchUserRoles_() {
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

    const userRoles = await db.collection(dbCollections.user_roles.name).find({}).toArray();

    const response = {
      isError: false,
      userRoles,
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

export async function fetchUserRoleById_(request: any) {
  const schema = zfd.formData({
    userRoleId: zfd.text(),
  });
  const params = request.nextUrl.searchParams;

  const { userRoleId } = schema.parse(params);

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
    const grade = await db.collection(dbCollections.user_roles.name).findOne({ _id: new BSON.ObjectId(userRoleId) });
    const response = {
      isError: false,
      grade,
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

export async function assignUserRole_(request: Request, session?: Session) {
  const schema = zfd.formData({
    userId: zfd.text(),
    roleId: zfd.text(),
  });

  const formBody = await request.json();

  const { userId, roleId } = schema.parse(formBody);

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

    const userRoleData = await db.collection(dbCollections.user_roles.name).findOne(
      {
        _id: new BSON.ObjectId(roleId),
      },
      {
        projection: {
          _id: 1,
        },
      },
    );

    if (!userRoleData) {
      const response = {
        isError: true,
        code: USER_ROLES_PROCESS_CODES.USER_ROLE_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    const userData = await db.collection(dbCollections.user_roles.name).findOne(
      {
        _id: new BSON.ObjectId(roleId),
      },
      {
        projection: {
          _id: 1,
        },
      },
    );

    if (!userData) {
      const response = {
        isError: true,
        code: USERS_PROCESS_CODES.USER_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    await db.collection(dbCollections.user_role_mappings.name).insertOne({
      created_at: new Date(),
      updated_at: new Date(),
      role_id: new BSON.ObjectId(roleId),
      user_id: new BSON.ObjectId(userId),
      //@ts-ignore
      created_by_id: new BSON.ObjectId(session?.user?._id),
    });

    const response = {
      isError: false,
      code: USER_ROLES_PROCESS_CODES.USER_ROLES_ASSIGNED,
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
