import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as PAGE_LINK_PROCESS_CODES } from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function editGrade_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    gradeId: zfd.text(),
    description: zfd.text(),
  });

  const formBody = await request.json();

  const { name, description, gradeId } = schema.parse(formBody);

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

    const existingGrade = await db.collection(dbCollections.grades.name).findOne({
      _id: new BSON.ObjectId(gradeId),
    });

    if (!existingGrade) {
      const response = {
        isError: true,
        code: PAGE_LINK_PROCESS_CODES.GRADE_NOT_FOUND,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    const regexPattern = new RegExp(`^\\s*${name}\\s*$`, 'i');

    const duplicateGrade = await db.collection(dbCollections.grades.name).findOne(
      {
        name: { $regex: regexPattern },
        _id: { $ne: new BSON.ObjectId(gradeId) },
      },
      {
        projection: {
          _id: 1,
        },
      },
    );

    if (duplicateGrade) {
      const response = {
        isError: true,
        code: PAGE_LINK_PROCESS_CODES.GRADE_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    const query = {
      _id: new BSON.ObjectId(gradeId),
    };

    const updateQuery = {
      name,
      description,
      updated_at: new Date(),
      //@ts-ignore
      updated_by_id: new BSON.ObjectId(session?.user?.id),
    };

    await db.collection(dbCollections.grades.name).updateOne(query, {
      $set: updateQuery,
    });

    const response = {
      isError: false,
      code: PAGE_LINK_PROCESS_CODES.GRADE_EDITED,
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
