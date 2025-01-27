import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as USER_PROCESS_CODES } from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function deleteUsers_(request: Request) {
  const schema = zfd.formData({
    userIds: zfd.repeatableOfType(zfd.text()),
  });

  const formBody = await request.json();
  const { userIds } = schema.parse(formBody);
  const objectIds = userIds.map((id) => new BSON.ObjectId(id));

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

    // Delete both users and their role mappings
    await Promise.all([
      // Delete users
      db.collection(dbCollections.users.name).deleteMany({
        _id: { $in: objectIds },
      }),

      // Delete role mappings
      db.collection(dbCollections.user_role_mappings.name).deleteMany({
        user_id: { $in: objectIds },
      }),
    ]);

    return new Response(
      JSON.stringify({
        isError: false,
        code: USER_PROCESS_CODES.USER_DELETED,
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
