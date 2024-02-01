import { dbClient } from "../lib/db";
import { realmApp } from "../lib/db/realm";
import AUTH_PROCESS_CODES from "./processCodes";

export default async function logout_(request: Request) {
  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: AUTH_PROCESS_CODES.UNKNOWN_ERROR,
      };
      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    await realmApp.currentUser?.logOut();

    const response = {
      isError: false,
      code: AUTH_PROCESS_CODES.USER_LOGGED_OUT_OK,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: AUTH_PROCESS_CODES.FAILED_TO_LOGOUT_USER,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}
