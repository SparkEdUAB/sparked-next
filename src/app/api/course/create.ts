import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as COURSE_PROCESS_CODES } from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function createCourse_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
    // schoolId: zfd.text().optional(),
    // programId: zfd.text().optional(),
  });
  const formBody = await request.json();

  const { name, description } = schema.parse(formBody);

  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.InternalServerError,
      });
    }
    const regexPattern = new RegExp(`^\\s*${name}\\s*$`, 'i');

    const course = await db.collection(dbCollections.courses.name).findOne({
      name: { $regex: regexPattern },
    });

    if (course) {
      const response = {
        isError: true,
        code: COURSE_PROCESS_CODES.COURSE_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    // const school = schoolId
    //   ? await db.collection(dbCollections.schools.name).findOne(
    //       {
    //         _id: new BSON.ObjectId(schoolId),
    //       },
    //       { projection: { _id: 1 } },
    //     )
    //   : null;

    // if (!school && schoolId) {
    //   const response = {
    //     isError: true,
    //     code: COURSE_PROCESS_CODES.SCHOOL_NOT_FOUND,
    //   };

    //   return new Response(JSON.stringify(response), {
    //     status: HttpStatusCode.NotFound,
    //   });
    // }

    // const program = programId
    //   ? await db.collection(dbCollections.programs.name).findOne(
    //       {
    //         _id: new BSON.ObjectId(programId),
    //       },
    //       { projection: { _id: 1 } },
    //     )
    //   : null;

    // if (!program && programId) {
    //   const response = {
    //     isError: true,
    //     code: COURSE_PROCESS_CODES.PROGRAM_NOT_FOUND,
    //   };

    //   return new Response(JSON.stringify(response), {
    //     status: HttpStatusCode.NotFound,
    //   });
    // }

    await db.collection(dbCollections.courses.name).insertOne({
      name,
      description,
      created_at: new Date(),
      updated_at: new Date(),
      //@ts-ignore
      created_by_id: new BSON.ObjectId(session?.user?.id),
      // school_id: new BSON.ObjectId(schoolId),
      // program_id: new BSON.ObjectId(programId),
    });

    const response = {
      isError: false,
      code: COURSE_PROCESS_CODES.COURSE_CREATED,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
