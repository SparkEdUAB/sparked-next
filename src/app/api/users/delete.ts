import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as USER_PROCESS_CODES } from './processCodes';
import { HttpStatusCode } from 'axios';
import { Session } from 'next-auth';
import { buildScopedQuery } from '../lib/organization';

export default async function deleteUsers_(request: Request, session?: Session) {
  const schema = zfd.formData({
    userIds: zfd.repeatableOfType(zfd.text()),
  });

  const formBody = await request.json();
  const { userIds } = schema.parse(formBody);
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

    const scopedQuery = await buildScopedQuery(
      db,
      session,
      { _id: { $in: userIds.map((id) => new BSON.ObjectId(id)) } },
      { includeLegacyUnscopedForDefault: true },
    );
    const scopedUsers = await db
      .collection(dbCollections.users.name)
      .find(scopedQuery, { projection: { _id: 1 } })
      .toArray();
    const scopedUserIds = scopedUsers.map((user) => user._id);

    await Promise.all([
      db.collection(dbCollections.users.name).deleteMany({ _id: { $in: scopedUserIds } }),
      db.collection(dbCollections.user_role_mappings.name).deleteMany({ user_id: { $in: scopedUserIds } }),
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
