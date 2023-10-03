import { zfd } from "zod-form-data";
import { realmApp } from "../lib/db/realm";
import { WORDS } from "utils/intl/data/constants";
import { dbClient } from "../lib/db";
import { dbCollections } from "../lib/db/collections";
import i18next from "i18next";

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
        msg: i18next.t("home"),
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
        msg: i18next.t("user_exist"),
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
      msg: i18next.t('user_created'),
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
      msg:
        code === 4348
          ? i18next.t("email_error")
          : i18next.t('unknown_error'),
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}
