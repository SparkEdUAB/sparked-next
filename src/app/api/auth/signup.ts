import { zfd } from "zod-form-data";
import { realmApp } from "../lib/db/realm";
import { translate } from "utils/intl";
import { WORDS } from "utils/intl/data/constants";
import { dbClient } from "../lib/db";
import { dbCollections } from "../lib/db/collections";

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
      console.log("signup_:error", "db error", db);

      const response = {
        isError: true,
        msg: translate(WORDS.unknown_error),
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
        msg: translate(WORDS.user_exist),
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
      msg: translate(WORDS.user_created),
      email,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    console.log("signup_:error", error);
    const errorCodeIndex = `${JSON.stringify(error)}`.lastIndexOf("code");

    const code =
      errorCodeIndex === -1
        ? 0
        : Number(`${error}`.substring(errorCodeIndex).match(/\d+/g));

    const resp = {
      isError: true,
      msg:
        code === 4348
          ? translate(WORDS.email_error, true)
          : translate(WORDS.unknown_error),
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}
