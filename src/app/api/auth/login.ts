import Realm from "realm";
import { zfd } from "zod-form-data";
import { dbClient } from "../lib/db";
import { dbCollections } from "../lib/db/collections";
import { realmApp } from "../lib/db/realm";
import AUTH_PROCESS_CODES from "./processCodes";

export default async function login_(request: Request) {
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
        code: AUTH_PROCESS_CODES.UNKOWN_ERROR,
      };
      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    const user = await db.collection(dbCollections.users.name).findOne(
      {
        email,
      },
      {
        projection: {
          email: 1,
          is_verified: 1,
        },
      }
    );

    if (!user) {
      const response = {
        isError: true,
        code: AUTH_PROCESS_CODES.USER_NOT_FOUND,
      };
      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    const credentials = Realm.Credentials.emailPassword(email, password);

    await realmApp.logIn(credentials);

    const response = {
      isError: false,
      code: AUTH_PROCESS_CODES.USER_LOGGED_IN_OK,
      user,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: AUTH_PROCESS_CODES.INVALID_CREDENTIALS,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}
