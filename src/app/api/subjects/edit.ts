import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as SUBJECT_PROCESS_CODES } from './processCodes';

export default async function editSubject_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    gradeId: zfd.text(),
    subjectId: zfd.text(),
    description: zfd.text(),
  });

  const formBody = await request.json();

  const { name, description, gradeId, subjectId } = schema.parse(formBody);

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
    const regexPattern = new RegExp(`^\\s*${name}\\s*$`, 'i');

    const gradeData = await db.collection(dbCollections.subjects.name).findOne(
      {
        name: { $regex: regexPattern },
        _id: { $ne: new BSON.ObjectId(subjectId) },
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
        code: SUBJECT_PROCESS_CODES.SUBJECT_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: 500,
      });
    }

    const query = {
      _id: new BSON.ObjectId(subjectId),
    };

    const updateQuery = {
      name,
      description,
      updated_at: new Date(),
      grade_id: new BSON.ObjectId(gradeId),
      //@ts-ignore
      updated_by_id: new BSON.ObjectId(session?.user?.id),
    };

    await db.collection(dbCollections.subjects.name).updateOne(query, {
      $set: updateQuery,
    });

    const response = {
      isError: false,
      code: SUBJECT_PROCESS_CODES.SUBJECT_EDITED,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: 500,
    });
  }
}
