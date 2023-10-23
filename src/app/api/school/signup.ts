import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import { zfd } from "zod-form-data";
import { dbClient } from "../lib/db";
import { dbCollections } from "../lib/db/collections";
import {
  default as AUTH_PROCESS_CODES,
  default as SCHOOL_PROCESS_CODES,
} from "./processCodes";

export default async function createSchool_(request: Request) {
  const schema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
  });
  const formBody = await request.json();


  console.log("formBody", formBody);

  const { name, description } = schema.parse(formBody);




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

    const user = await db.collection(dbCollections.schools.name).findOne({
      name,
    });

    if (user) {
      const response = {
        isError: true,
        code: SCHOOL_PROCESS_CODES.SCHOOL_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    await db.collection(dbCollections.schools.name).insertOne({
      name,
      description,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const response = {
      isError: false,
      code: AUTH_PROCESS_CODES.USER_CREATED,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}
