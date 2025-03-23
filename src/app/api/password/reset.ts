import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { HttpStatusCode } from 'axios';
import bcrypt from 'bcryptjs';
import AUTH_PROCESS_CODES from '../auth/processCodes';

export default async function resetPassword_(request: Request) {
  const { token, newPassword } = await request.json();

  try {
    const db = await dbClient();

    if (!db) {
      return new Response(
        JSON.stringify({
          isError: true,
          code: AUTH_PROCESS_CODES.DB_CONNECTION_FAILED,
        }),
        {
          status: HttpStatusCode.InternalServerError,
        },
      );
    }

    const user = await db.collection(dbCollections.users.name).findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return new Response(
        JSON.stringify({
          isError: true,
          code: AUTH_PROCESS_CODES.INVALID_RESET_TOKEN,
        }),
        {
          status: HttpStatusCode.BadRequest,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.collection(dbCollections.users.name).updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: '', resetTokenExpiry: '' },
      },
    );

    return new Response(
      JSON.stringify({
        isError: false,
        code: AUTH_PROCESS_CODES.PASSWORD_RESET_SUCCESS,
      }),
      {
        status: HttpStatusCode.Ok,
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        isError: true,
        code: AUTH_PROCESS_CODES.UNKNOWN_ERROR,
      }),
      {
        status: HttpStatusCode.InternalServerError,
      },
    );
  }
}
