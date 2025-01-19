import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as SUBJECT_PROCESS_CODES } from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function deleteSubjects_(request: Request) {
  const schema = zfd.formData({
    subjectIds: zfd.repeatableOfType(zfd.text()),
  });

  const formBody = await request.json();

  const { subjectIds } = schema.parse(formBody);

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

    await db.collection(dbCollections.subjects.name).deleteMany({
      _id: {
        $in: subjectIds.map((i) => new BSON.ObjectId(i)),
      },
    });

    const response = {
      isError: false,
      code: SUBJECT_PROCESS_CODES.SUBJECT_DELETED,
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
