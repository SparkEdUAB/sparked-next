import { ResetPasswordEmail } from 'emails/ResetPasswordEmail';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { HttpStatusCode } from 'axios';
import { Resend } from 'resend';
import AUTH_PROCESS_CODES from '../auth/processCodes';
import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function forgotPassword_(request: Request) {
  const { email } = await request.json();

  try {
    const db = await dbClient();

    if (!db) {
      return new Response(
        JSON.stringify({
          isError: true,
          code: AUTH_PROCESS_CODES.DB_CONNECTION_FAILED,
          message: getProcessCodeMeaning(AUTH_PROCESS_CODES.DB_CONNECTION_FAILED),
        }),
        {
          status: HttpStatusCode.InternalServerError,
        },
      );
    }

    const user = await db.collection(dbCollections.users.name).findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({
          isError: true,
          code: AUTH_PROCESS_CODES.USER_NOT_FOUND,
          message: getProcessCodeMeaning(AUTH_PROCESS_CODES.USER_NOT_FOUND),
        }),
        {
          status: HttpStatusCode.NotFound,
        },
      );
    }

    const resetToken = Math.random().toString(36).substring(2);

    await db.collection(dbCollections.users.name).updateOne(
      { email },
      { $set: { resetToken, resetTokenExpiry: Date.now() + 3600000 } }, // 1 hour expiry
    );

    const { error } = await resend.emails.send({
      from: 'Sparked Support <support@sparkednext.app>',
      to: email,
      subject: 'Password Reset',
      react: ResetPasswordEmail({ resetLink: `${process.env.BASE_URL}/auth/reset-password?token=${resetToken}` }),
    });

    if (error) {
      return new Response(
        JSON.stringify({
          isError: true,
          code: AUTH_PROCESS_CODES.EMAIL_SEND_FAILED,
          message: getProcessCodeMeaning(AUTH_PROCESS_CODES.EMAIL_SEND_FAILED),
        }),
        {
          status: HttpStatusCode.InternalServerError,
        },
      );
    }

    return new Response(
      JSON.stringify({
        isError: false,
        code: AUTH_PROCESS_CODES.EMAIL_SENT,
        message: getProcessCodeMeaning(AUTH_PROCESS_CODES.EMAIL_SENT),
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
        message: getProcessCodeMeaning(AUTH_PROCESS_CODES.UNKNOWN_ERROR),
      }),
      {
        status: HttpStatusCode.InternalServerError,
      },
    );
  }
}
