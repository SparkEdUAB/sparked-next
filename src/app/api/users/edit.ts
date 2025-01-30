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
    role: zfd.text(),
  });

  const formBody = await request.json();
  const { _id, email, firstName, lastName, role } = schema.parse(formBody);

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

    // Check if email exists for other users
    const regexPattern = new RegExp(`^\\s*${email}\\s*$`, 'i');
    const existingUser = await db.collection(dbCollections.users.name).findOne({
      email: { $regex: regexPattern },
      _id: { $ne: new BSON.ObjectId(_id) },
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

    // Update user
    await db.collection(dbCollections.users.name).updateOne(
      { _id: new BSON.ObjectId(_id) },
      {
        $set: {
          email,
          firstName,
          lastName,
          updatedAt: new Date(),
          //   @ts-expect-error
          updatedById: session?.user?.id ? new BSON.ObjectId(session.user.id) : null,
        },
      },
    );

    // Update role mapping
    await db.collection(dbCollections.user_role_mappings.name).updateOne(
      { user_id: new BSON.ObjectId(_id) },
      {
        $set: {
          role_id: roleExists._id,
          updated_at: new Date(),
          //   @ts-expect-error
          updated_by_id: session?.user?.id ? new BSON.ObjectId(session.user.id) : null,
        },
      },
      { upsert: true }, // Create if doesn't exist
    );

    return new Response(
      JSON.stringify({
        isError: false,
        code: USER_PROCESS_CODES.USER_EDITED,
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
