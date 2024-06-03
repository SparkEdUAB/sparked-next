import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import SUBJECT_PROCESS_CODES from './processCodes';

export default async function createSubject_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
    gradeId: zfd.text(),
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
        status: 200,
      });
    }
    const regexPattern = new RegExp(`^\\s*${name}\\s*$`, 'i');

    const subjectData = await db.collection(dbCollections.subjects.name).findOne(
      {
        name: { $regex: regexPattern },
      },
      {
        projection: {
          _id: 1,
        },
      },
    );

    if (subjectData) {
      const response = {
        isError: true,
        code: SUBJECT_PROCESS_CODES.SUBJECT_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: 500,
      });
    }

    await db.collection(dbCollections.subjects.name).insertOne({
      name,
      description,
      created_at: new Date(),
      updated_at: new Date(),
      grade_id: new BSON.ObjectId(gradeId),
      //@ts-ignore
      created_by_id: new BSON.ObjectId(session?.user?.id),
    });

    const response = {
      isError: false,
      code: SUBJECT_PROCESS_CODES.SUBJECT_CREATED,
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
