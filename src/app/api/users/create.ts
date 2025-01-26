import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as USER_PROCESS_CODES } from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function createUser_(request: Request, session?: Session) {
  const schema = zfd.formData({
    email: zfd.text(),
    firstName: zfd.text(),
    lastName: zfd.text(),
    role: zfd.text(),
    password: zfd.text(),
  });
  const formBody = await request.json();

  const { email, firstName, lastName, role, password } = schema.parse(formBody);

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

    const regexPattern = new RegExp(`^\\s*${email}\\s*$`, 'i');

    const user = await db.collection(dbCollections.users.name).findOne({
      email: { $regex: regexPattern },
    });

    if (user) {
      const response = {
        isError: true,
        code: USER_PROCESS_CODES.USER_EXIST,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    const result = await db.collection(dbCollections.users.name).insertOne({
      email,
      firstName,
      lastName,
      role,
      password, // Note: In production, ensure password is hashed
      createdAt: new Date(),
      updatedAt: new Date(),
      //   @ts-expect-error
      createdById: session?.user?.id ? new BSON.ObjectId(session.user.id) : null,
    });

    const response = {
      isError: false,
      code: USER_PROCESS_CODES.USER_CREATED,
      userId: result.insertedId,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Created,
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
