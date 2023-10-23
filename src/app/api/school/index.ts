import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import { zfd } from "zod-form-data";
import { dbClient } from "../lib/db";
import { dbCollections } from "../lib/db/collections";
import { p_fetchSchoolsWithCreator } from "./pipelines";

export default async function fetchSchools_(request: Request) {
  const schema = zfd.formData({
    limit: zfd.numeric(),
    skip: zfd.numeric(),
  });
  const formBody = await request.json();

  const { limit, skip } = schema.parse(formBody);

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

    const schools = await db
      .collection(dbCollections.schools.name)
      .aggregate(p_fetchSchoolsWithCreator()).toArray()

    const response = {
      isError: false,
      schools,
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
