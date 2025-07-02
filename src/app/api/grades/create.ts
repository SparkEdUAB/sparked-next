import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as GRADE_PROCESS_CODES } from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function createGrade_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
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

    const gradeData = await db.collection(dbCollections.grades.name).findOne(
      {
        name: { $regex: regexPattern },
      },
      {
        projection: {
          _id: 1,
        },
      },
    );

    if (gradeData) {
      const response = {
        isError: true,
        code: GRADE_PROCESS_CODES.GRADE_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    await db.collection(dbCollections.grades.name).insertOne({
      name,
      description,
      created_at: new Date(),
      updated_at: new Date(),
      // @ts-expect-error
      institutionId: new BSON.ObjectId(session?.user?.institutionId),
      // @ts-expect-error
      created_by_id: new BSON.ObjectId(session?.user?._id),
    });

    const response = {
      isError: false,
      code: GRADE_PROCESS_CODES.GRADE_CREATED,
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
