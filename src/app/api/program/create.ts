import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import { BSON } from "mongodb";
import { Session } from "next-auth";
import { zfd } from "zod-form-data";
import { dbClient } from "../lib/db";
import { dbCollections } from "../lib/db/collections";
import { default as PROGRAM_PROCESS_CODES } from "./processCodes";

export default async function createProgram_(
  request: Request,
  session?: Session
) {
  const schema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
    schoolId: zfd.text(),
  });
  const formBody = await request.json();

  const { name, description, schoolId } = schema.parse(formBody);

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
    const regexPattern = new RegExp(name, "i");

    const program = await db.collection(dbCollections.programs.name).findOne({
      name: { $regex: regexPattern },
    });

    if (program) {
      const response = {
        isError: true,
        code: PROGRAM_PROCESS_CODES.PROGRAM_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    const school = await db.collection(dbCollections.programs.name).findOne(
      {
        school_id: new BSON.ObjectId(schoolId),
      },
      { projection: { _id: 1 } }
    );

       if (!school) {
         const response = {
           isError: true,
           code: PROGRAM_PROCESS_CODES.SCHOOL_NOT_FOUND,
         };

         return new Response(JSON.stringify(response), {
           status: 200,
         });
       }

    await db.collection(dbCollections.programs.name).insertOne({
      name,
      description,
      created_at: new Date(),
      updated_at: new Date(),
      //@ts-ignore
      created_by_id: new BSON.ObjectId(session?.user?.id),
      school_id: new BSON.ObjectId(schoolId),
    });

    const response = {
      isError: false,
      code: PROGRAM_PROCESS_CODES.PROGRAM_CREATED,
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
