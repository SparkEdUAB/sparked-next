import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as USER_PROCESS_CODES } from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function editUser_(request: Request, session?: Session) {
  const schema = zfd.formData({
    _id: zfd.text(),
    email: zfd.text(),
    firstName: zfd.text(),
    lastName: zfd.text(),
    role: zfd.text().nullable().optional(),
  });
  const formBody = await request.json();

  const { _id, email, firstName, lastName, role } = schema.parse(formBody);

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

    const existingUser = await db.collection(dbCollections.users.name).findOne({
      email: { $regex: regexPattern },
      _id: { $ne: new BSON.ObjectId(_id) },
    });

    if (existingUser) {
      const response = {
        isError: true,
        code: USER_PROCESS_CODES.USER_EXIST,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    await db.collection(dbCollections.users.name).updateOne(
      { _id: new BSON.ObjectId(_id) },
      {
        $set: {
          email,
          firstName,
          lastName,
          role,
          updatedAt: new Date(),
          //   @ts-expect-error
          updatedById: session?.user?.id ? new BSON.ObjectId(session.user.id) : null,
        },
      },
    );

    const response = {
      isError: false,
      code: USER_PROCESS_CODES.USER_EDITED,
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
