import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { HttpStatusCode } from 'axios';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';

export default async function fetchAvailableRoles_() {
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

    const roles = await db.collection(dbCollections.user_roles.name).find({}).toArray();

    return new Response(
      JSON.stringify({
        isError: false,
        roles,
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