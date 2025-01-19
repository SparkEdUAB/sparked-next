import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import COURSE_PROCESS_CODES from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function editCourse_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
    schoolId: zfd.text().optional(),
    programId: zfd.text().optional(),
    courseId: zfd.text(),
  });
  const formBody = await request.json();

  const { name, description, schoolId, programId, courseId } = schema.parse(formBody);
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

    const school = schoolId
      ? await db.collection(dbCollections.schools.name).findOne(
          {
            _id: new BSON.ObjectId(schoolId),
          },
          { projection: { _id: 1 } },
        )
      : null;

    if (!school && schoolId) {
      const response = {
        isError: true,
        code: COURSE_PROCESS_CODES.SCHOOL_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    const program = programId
      ? await db.collection(dbCollections.programs.name).findOne(
          {
            _id: new BSON.ObjectId(programId),
          },
          { projection: { _id: 1 } },
        )
      : null;

    if (!program && programId) {
      const response = {
        isError: true,
        code: COURSE_PROCESS_CODES.PROGRAM_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    const regexPattern = new RegExp(`^\\s*${name}\\s*$`, 'i');

    const course = await db.collection(dbCollections.courses.name).findOne({
      name: { $regex: regexPattern },
      _id: { $ne: new BSON.ObjectId(courseId) },
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

    const query = {
      _id: new BSON.ObjectId(courseId),
    };

    const updateQuery = {
      name,
      description,
      updated_at: new Date(),
      school_id: new BSON.ObjectId(schoolId),

      //@ts-ignore
      updated_by_id: new BSON.ObjectId(session?.user?.id),
    };

    await db.collection(dbCollections.courses.name).updateOne(query, {
      $set: updateQuery,
    });

    const response = {
      isError: false,
      code: COURSE_PROCESS_CODES.COURSE_EXIST,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
