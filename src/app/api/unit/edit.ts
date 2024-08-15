import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import UNIT_PROCESS_CODES from './processCodes';

export default async function editUnit_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
    schoolId: zfd.text().optional(),
    programId: zfd.text().optional(),
    courseId: zfd.text().optional(),
    subjectId: zfd.text().optional(),
    unitId: zfd.text(),
  });
  const formBody = await request.json();

  const { name, description, schoolId, programId, courseId, unitId, subjectId } = schema.parse(formBody);
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
        code: UNIT_PROCESS_CODES.SCHOOL_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
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
        code: UNIT_PROCESS_CODES.PROGRAM_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    const course = courseId
      ? await db.collection(dbCollections.courses.name).findOne(
          {
            _id: new BSON.ObjectId(courseId),
          },
          { projection: { _id: 1 } },
        )
      : null;

    if (!course && courseId) {
      const response = {
        isError: true,
        code: UNIT_PROCESS_CODES.COURSE_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    const subject = subjectId
      ? await db.collection(dbCollections.subjects.name).findOne(
          {
            _id: new BSON.ObjectId(subjectId),
          },
          { projection: { _id: 1 } },
        )
      : null;

    if (!subject && subjectId) {
      const response = {
        isError: true,
        code: UNIT_PROCESS_CODES.SUBJECT_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    const regexPattern = new RegExp(`^\\s*${name}\\s*$`, 'i');

    const unit = await db.collection(dbCollections.units.name).findOne({
      name: { $regex: regexPattern },
      _id: { $ne: new BSON.ObjectId(unitId) },
    });

    if (unit) {
      const response = {
        isError: true,
        code: UNIT_PROCESS_CODES.UNIT_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    const query = {
      _id: new BSON.ObjectId(unitId),
    };

    const updateQuery = {
      name,
      description,
      updated_at: new Date(),
      school_id: new BSON.ObjectId(schoolId),
      course_id: new BSON.ObjectId(courseId),
      program_id: new BSON.ObjectId(programId),
      subject_id: new BSON.ObjectId(subjectId),
      //@ts-ignore
      updated_by_id: new BSON.ObjectId(session?.user?.id),
    };

    await db.collection(dbCollections.units.name).updateOne(query, {
      $set: updateQuery,
    });

    const response = {
      isError: false,
      code: UNIT_PROCESS_CODES.UNIT_EDITED,
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
      status: 200,
    });
  }
}
