import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import { BSON } from "mongodb";
import { Session } from "next-auth";
import { zfd } from "zod-form-data";
import { dbClient } from "../lib/db";
import { dbCollections } from "../lib/db/collections";
import RESOURCE_PROCESS_CODES from "./processCodes";

export default async function createMediaContent_(
  request: Request,
  session?: Session
) {
  const schema = zfd.formData({
    name: zfd.text(),
    description: zfd.text(),
    unitId: zfd.text(),
    schoolId: zfd.text().optional(),
    programId: zfd.text().optional(),
    courseId: zfd.text().optional(),
    topicId: zfd.text().optional(),
    fileUrl: zfd.text().optional(),
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
  } = schema.parse(formBody);

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
    const topic = topicId
      ? await db.collection(dbCollections.topics.name).findOne(
          {
            _id: new BSON.ObjectId(topicId),
          },
          { projection: { _id: 1 } }
        )
      : null;

    if (!topic) {
      const response = {
        isError: true,
        code: RESOURCE_PROCESS_CODES.TOPIC_NOT_FOUND,
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
          { projection: { _id: 1 } }
        )
      : null;

    if (!school && schoolId) {
      const response = {
        isError: true,
        code: RESOURCE_PROCESS_CODES.SCHOOL_NOT_FOUND,
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
          { projection: { _id: 1 } }
        )
      : null;

    if (!program && programId) {
      const response = {
        isError: true,
        code: RESOURCE_PROCESS_CODES.PROGRAM_NOT_FOUND,
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
          { projection: { _id: 1 } }
        )
      : null;

    if (!course && courseId) {
      const response = {
        isError: true,
        code: RESOURCE_PROCESS_CODES.COURSE_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    const unit = await db.collection(dbCollections.units.name).findOne(
      {
        _id: new BSON.ObjectId(unitId),
      },
      { projection: { _id: 1 } }
    );

    if (!unit) {
      const response = {
        isError: true,
        code: RESOURCE_PROCESS_CODES.UNIT_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    await db.collection(dbCollections.media_content.name).insertOne({
      name,
      description,
      created_at: new Date(),
      updated_at: new Date(),
      //@ts-ignore
      created_by_id: new BSON.ObjectId(session?.user?.id),
      school_id: new BSON.ObjectId(schoolId),
      program_id: new BSON.ObjectId(programId),
      course_id: new BSON.ObjectId(courseId),
      unit_id: new BSON.ObjectId(unitId),
      topic_id: new BSON.ObjectId(topicId),
      file_url: fileUrl,
    });

    const response = {
      isError: false,
      code: RESOURCE_PROCESS_CODES.RESOURCE_CREATED,
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
