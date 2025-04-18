import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import TOPIC_PROCESS_CODES from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function editTopic_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
    schoolId: zfd.text().optional(),
    programId: zfd.text().optional(),
    courseId: zfd.text().optional(),
    gradeId: zfd.text().optional(),
    subjectId: zfd.text().optional(),
    unitId: zfd.text().optional().nullable(),
    topicId: zfd.text(),
  });
  const formBody = await request.json();

  const { name, description, schoolId, programId, courseId, unitId, topicId, gradeId, subjectId } =
    schema.parse(formBody);
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
        code: TOPIC_PROCESS_CODES.SCHOOL_NOT_FOUND,
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
        code: TOPIC_PROCESS_CODES.PROGRAM_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
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
        code: TOPIC_PROCESS_CODES.COURSE_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

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
        code: TOPIC_PROCESS_CODES.GRADE_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
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
        code: TOPIC_PROCESS_CODES.SUBJECT_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    // Only check unit if unitId is provided
    let unit = null;
    if (unitId) {
      unit = await db.collection(dbCollections.units.name).findOne(
        {
          _id: new BSON.ObjectId(unitId),
        },
        { projection: { _id: 1 } },
      );

      if (!unit) {
        const response = {
          isError: true,
          code: TOPIC_PROCESS_CODES.UNIT_NOT_FOUND,
        };

        return new Response(JSON.stringify(response), {
          status: HttpStatusCode.NotFound,
        });
      }
    }

    const regexPattern = new RegExp(`^\\s*${name}\\s*$`, 'i');

    const topic = await db.collection(dbCollections.topics.name).findOne({
      name: { $regex: regexPattern },
      _id: { $ne: new BSON.ObjectId(topicId) },
    });

    if (topic) {
      const response = {
        isError: true,
        code: TOPIC_PROCESS_CODES.TOPIC_EXIST,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    const query = {
      _id: new BSON.ObjectId(topicId),
    };

    // Create update object with only defined fields
    const updateQuery: any = {
      name,
      description,
      updated_at: new Date(),
      //@ts-ignore
      updated_by_id: new BSON.ObjectId(session?.user?._id),
    };

    // Only add optional fields if they exist
    if (schoolId) updateQuery.school_id = new BSON.ObjectId(schoolId);
    if (courseId) updateQuery.course_id = new BSON.ObjectId(courseId);
    if (programId) updateQuery.program_id = new BSON.ObjectId(programId);
    if (unitId) updateQuery.unit_id = new BSON.ObjectId(unitId);
    if (gradeId) updateQuery.grade_id = new BSON.ObjectId(gradeId);
    if (subjectId) updateQuery.subject_id = new BSON.ObjectId(subjectId);

    await db.collection(dbCollections.topics.name).updateOne(query, {
      $set: updateQuery,
    });

    const response = {
      isError: false,
      code: TOPIC_PROCESS_CODES.TOPIC_EDITED,
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
