import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { default as UNIT_PROCESS_CODES } from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function createUnit_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
    subjectId: zfd.text(), // Subject is required
    schoolId: zfd.text().optional(),
    programId: zfd.text().optional(),
    courseId: zfd.text().optional(),
    gradeId: zfd.text().optional(),
  });
  const formBody = await request.json();

  const { name, description, schoolId, programId, courseId, subjectId, gradeId } = schema.parse(formBody);

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

    const unit = await db.collection(dbCollections.units.name).findOne({
      name: { $regex: regexPattern },
    });

    if (unit) {
      const response = {
        isError: true,
        code: UNIT_PROCESS_CODES.UNIT_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    // Check if school exists if schoolId is provided
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
        status: HttpStatusCode.NotFound,
      });
    }

    // Check if program exists if programId is provided
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
        status: HttpStatusCode.NotFound,
      });
    }

    // Check if course exists if courseId is provided
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
        status: HttpStatusCode.NotFound,
      });
    }

    // Check if grade exists if gradeId is provided
    const grade = gradeId
      ? await db.collection(dbCollections.grades.name).findOne(
          {
            _id: new BSON.ObjectId(gradeId),
          },
          { projection: { _id: 1 } },
        )
      : null;

    if (!grade && gradeId) {
      const response = {
        isError: true,
        code: UNIT_PROCESS_CODES.GRADE_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    // Subject is required
    const subject = await db.collection(dbCollections.subjects.name).findOne(
      {
        _id: new BSON.ObjectId(subjectId),
      },
      { projection: { _id: 1 } },
    );

    if (!subject) {
      const response = {
        isError: true,
        code: UNIT_PROCESS_CODES.SUBJECT_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    // Create unit document with required and optional fields
    const unitDocument = {
      name,
      description,
      created_at: new Date(),
      updated_at: new Date(),
      // @ts-ignore
      created_by_id: new BSON.ObjectId(session?.user?._id),
      subject_id: new BSON.ObjectId(subjectId),
    };

    // Add optional fields if they exist
    // if (schoolId) unitDocument.school_id = new BSON.ObjectId(schoolId);
    // if (programId) unitDocument.program_id = new BSON.ObjectId(programId);
    // if (courseId) unitDocument.course_id = new BSON.ObjectId(courseId);
    // @ts-ignore
    if (gradeId) unitDocument.grade_id = new BSON.ObjectId(gradeId);

    await db.collection(dbCollections.units.name).insertOne(unitDocument);

    const response = {
      isError: false,
      code: UNIT_PROCESS_CODES.UNIT_CREATED,
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
