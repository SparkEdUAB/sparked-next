import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as USER_ROLES_PROCESS_CODES } from './processCodes';

export default async function createUserRole_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
  });

  const formBody = await request.json();

  const { name, description } = schema.parse(formBody);

  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
      };
      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }
    const regexPattern = new RegExp(`^\\s*${name}\\s*$`, 'i');

<<<<<<<< HEAD:src/app/api/user-roles/create.ts
    const userRoleData = await db.collection(dbCollections.user_roles.name).findOne(
========
    const gradeData = await db.collection(dbCollections.grades.name).findOne(
>>>>>>>> main:src/app/api/grade/create.ts
      {
        name: { $regex: regexPattern },
      },
      {
        projection: {
          _id: 1,
        },
      },
    );

    if (userRoleData) {
      const response = {
        isError: true,
        code: USER_ROLES_PROCESS_CODES.USER_ROLE_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

<<<<<<<< HEAD:src/app/api/user-roles/create.ts
    await db.collection(dbCollections.user_roles.name).insertOne({
========
    await db.collection(dbCollections.grades.name).insertOne({
>>>>>>>> main:src/app/api/grade/create.ts
      name,
      description,
      created_at: new Date(),
      updated_at: new Date(),
      //@ts-ignore
      created_by_id: new BSON.ObjectId(session?.user?.id),
    });

    const response = {
      isError: false,
      code: USER_ROLES_PROCESS_CODES.USER_ROLE_CREATED,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}
