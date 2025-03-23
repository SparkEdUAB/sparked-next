import { dbClient } from '../lib/db';
import AUTH_PROCESS_CODES from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function logout_() {
  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: AUTH_PROCESS_CODES.UNKNOWN_ERROR,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.InternalServerError,
      });
    }

    const response = {
      isError: false,
      code: AUTH_PROCESS_CODES.USER_LOGGED_OUT_OK,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch {
    const resp = {
      isError: true,
      code: AUTH_PROCESS_CODES.FAILED_TO_LOGOUT_USER,
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
