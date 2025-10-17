import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import RESOURCE_PROCESS_CODES from './processCodes';
import MEDIA_CONTENT_PROCESS_CODES from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function createMediaContent_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
    topicId: zfd.text().optional(),
    unitId: zfd.text().optional(),
    schoolId: zfd.text().optional(),
    programId: zfd.text().optional(),
    courseId: zfd.text().optional(),
    subjectId: zfd.text().optional(),
    gradeId: zfd.text().optional(),
    institutionId: zfd.text().optional(),
    fileUrl: zfd.text().optional().nullable(),
    thumbnailUrl: zfd.text().optional(),
    externalUrl: zfd.text().optional().nullable(),
  });
  const formBody = await request.json();

  const {
    name,
    description,
    schoolId,
    programId,
    courseId,
    unitId,
    topicId,
    fileUrl,
    gradeId,
    subjectId,
    thumbnailUrl,
    externalUrl,
    institutionId,
  } = schema.parse(formBody);

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
    const topic = topicId
      ? await db.collection(dbCollections.topics.name).findOne(
          {
            _id: new BSON.ObjectId(topicId),
          },
          { projection: { _id: 1 } },
        )
      : null;

    if (!topic && topicId) {
      const response = {
        isError: true,
        code: RESOURCE_PROCESS_CODES.TOPIC_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
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
        code: RESOURCE_PROCESS_CODES.SCHOOL_NOT_FOUND,
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
        code: RESOURCE_PROCESS_CODES.PROGRAM_NOT_FOUND,
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
        code: RESOURCE_PROCESS_CODES.COURSE_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    const unit = await db.collection(dbCollections.units.name).findOne(
      {
        _id: new BSON.ObjectId(unitId),
      },
      { projection: { _id: 1 } },
    );

    if (!unit && unitId) {
      const response = {
        isError: true,
        code: RESOURCE_PROCESS_CODES.UNIT_NOT_FOUND,
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
        code: MEDIA_CONTENT_PROCESS_CODES.GRADE_NOT_FOUND,
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
        code: MEDIA_CONTENT_PROCESS_CODES.SUBJECT_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    await db.collection(dbCollections.media_content.name).insertOne({
      name,
      description,
      created_at: new Date(),
      updated_at: new Date(),
      //@ts-ignore
      created_by_id: new BSON.ObjectId(session?.user?.id),
      ...(schoolId ? { school_id: new BSON.ObjectId(schoolId) } : {}),
      ...(programId ? { program_id: new BSON.ObjectId(programId) } : {}),
      ...(courseId ? { course_id: new BSON.ObjectId(courseId) } : {}),
      ...(unitId ? { unit_id: new BSON.ObjectId(unitId) } : {}),
      ...(topicId ? { topic_id: new BSON.ObjectId(topicId) } : {}),
      ...(gradeId ? { grade_id: new BSON.ObjectId(gradeId) } : {}),
      ...(subjectId ? { subject_id: new BSON.ObjectId(subjectId) } : {}),
      // Use institutionId from request or fall back to user's institution
      institution_id: institutionId ? new BSON.ObjectId(institutionId) : 
                     (session?.institution_id ? new BSON.ObjectId(session.institution_id) : null),
      file_url: fileUrl,
      thumbnail_url: thumbnailUrl,
      external_url: externalUrl,
    });

    const response = {
      isError: false,
      code: RESOURCE_PROCESS_CODES.RESOURCE_CREATED,
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
