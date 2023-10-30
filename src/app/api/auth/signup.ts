import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import { zfd } from "zod-form-data";
import { dbClient } from "../lib/db";
import { dbCollections } from "../lib/db/collections";
import { realmApp } from "../lib/db/realm";
import AUTH_PROCESS_CODES from "./processCodes";

export default async function signup_(request: Request) {
  const schema = zfd.formData({
    email: zfd.text(),
    password: zfd.text(),
  });
  const formBody = await request.json();

  const { email, password } = schema.parse(formBody);

  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
      };
      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    const user = await db.collection(dbCollections.users.name).findOne({
      email,
    });

    if (user) {
      const response = {
        isError: true,
        code: AUTH_PROCESS_CODES.USER_ALREADY_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    const resp = await realmApp.emailPasswordAuth.registerUser({
      email,
      password,
    });

    //TODO: verify schema
    await db.collection(dbCollections.users.name).insertOne({
      email,
      is_verified: false,
      created_at: new Date(),
    });

    const response = {
      isError: false,
      code: AUTH_PROCESS_CODES.USER_CREATED,
      email,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    const errorCodeIndex = `${JSON.stringify(error)}`.lastIndexOf("code");

    const code =
      errorCodeIndex === -1
        ? 0
        : Number(`${error}`.substring(errorCodeIndex).match(/\d+/g));

    const resp = {
      isError: true,
      code,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}
