import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import PROGRAM_PROCESS_CODES from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function editProgram_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    _id: zfd.text(),
    description: zfd.text(),
    schoolId: zfd.text(),
  });
  const formBody = await request.json();

  const { name, description, _id, schoolId } = schema.parse(formBody);

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

    const program = await db.collection(dbCollections.programs.name).findOne({
      name: { $regex: regexPattern },
      _id: { $ne: new BSON.ObjectId(_id) },
    });

    if (program) {
      const response = {
        isError: true,
        code: PROGRAM_PROCESS_CODES.PROGRAM_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    const query = {
      _id: new BSON.ObjectId(_id),
    };

    const school = await db.collection(dbCollections.schools.name).findOne(
      {
        _id: new BSON.ObjectId(schoolId),
      },
      { projection: { _id: 1 } },
    );

    if (!school) {
      const response = {
        isError: true,
        code: PROGRAM_PROCESS_CODES.SCHOOL_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    const updateQuery = {
      name,
      description,
      updated_at: new Date(),
      school_id: new BSON.ObjectId(schoolId),

      //@ts-ignore
      updated_by_id: new BSON.ObjectId(session?.user?._id),
    };

    await db.collection(dbCollections.programs.name).updateOne(query, {
      $set: updateQuery,
    });

    const response = {
      isError: false,
      code: PROGRAM_PROCESS_CODES.PROGRAM_EDITED,
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
