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
      return new Response(
        JSON.stringify({
          isError: true,
          code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
        }),
        { status: HttpStatusCode.InternalServerError },
      );
    }

    // Check if user exists
    const regexPattern = new RegExp(`^\\s*${email}\\s*$`, 'i');
    const existingUser = await db.collection(dbCollections.users.name).findOne({
      email: { $regex: regexPattern },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          isError: true,
          code: USER_PROCESS_CODES.USER_EXIST,
        }),
        { status: HttpStatusCode.BadRequest },
      );
    }

    // Verify role exists
    const roleExists = await db.collection(dbCollections.user_roles.name).findOne({ name: role });
    if (!roleExists) {
      return new Response(
        JSON.stringify({
          isError: true,
          code: USER_PROCESS_CODES.INVALID_ROLE,
        }),
        { status: HttpStatusCode.BadRequest },
      );
    }

    // Create user
    const result = await db.collection(dbCollections.users.name).insertOne({
      email,
      firstName,
      lastName,
      password, // Note: In production, ensure password is hashed
      createdAt: new Date(),
      updatedAt: new Date(),
      //   @ts-expect-error
      createdById: session?.user?.id ? new BSON.ObjectId(session.user.id) : null,
    });

    // Create role mapping
    await db.collection(dbCollections.user_role_mappings.name).insertOne({
      user_id: result.insertedId,
      role_id: roleExists._id,
      created_at: new Date(),
      updated_at: new Date(),
      //   @ts-expect-error
      created_by_id: session?.user?.id ? new BSON.ObjectId(session.user.id) : null,
    });

    return new Response(
      JSON.stringify({
        isError: false,
        code: USER_PROCESS_CODES.USER_CREATED,
        userId: result.insertedId,
      }),
      { status: HttpStatusCode.Created },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        isError: true,
        code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
      }),
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
