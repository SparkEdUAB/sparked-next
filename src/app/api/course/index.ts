import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { p_fetchCoursesWithMetaData } from './pipelines';
import { getDbFieldNamesConfigStatus } from '../config';
import { COURSE_FIELD_NAMES_CONFIG } from './constants';
import { HttpStatusCode } from 'axios';

const dbConfigData = COURSE_FIELD_NAMES_CONFIG;

export default async function fetchCourses_(request: any) {
  const schema = zfd.formData({
    limit: zfd.numeric(),
    skip: zfd.numeric(),
    withMetaData: zfd.text().optional(),
  });
  const params = request.nextUrl.searchParams;

  const { limit, skip, withMetaData } = schema.parse(params);
  const isWithMetaData = withMetaData == 'true';

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

    let courses = [];

    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    if (isWithMetaData) {
      courses = await db
        .collection(dbCollections.courses.name)
        .aggregate(p_fetchCoursesWithMetaData({ query: {}, project }))
        .toArray();
    } else {
      courses = await db
        .collection(dbCollections.courses.name)
        .find(
          {},
          {
            limit,
            skip,
          },
        )
        .toArray();
    }

    const response = {
      isError: false,
      courses,
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

export async function fetchCourseById_(request: any) {
  const schema = zfd.formData({
    courseId: zfd.text(),
    withMetaData: zfd.text(),
  });
  const params = request.nextUrl.searchParams;

  const { courseId, withMetaData } = schema.parse(params);

  const isWithMetaData = withMetaData == 'true';

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

    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    let course;

    if (isWithMetaData) {
      course = await db
        .collection(dbCollections.courses.name)
        .aggregate(
          p_fetchCoursesWithMetaData({
            project,
            query: {
              _id: new BSON.ObjectId(courseId),
            },
          }),
        )
        .toArray();

      course = course.length ? course[0] : null;
    } else {
      course = await db.collection(dbCollections.courses.name).findOne({ _id: new BSON.ObjectId(courseId) });
    }

    const response = {
      isError: false,
      course,
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

export async function deleteCourse_(request: Request) {
  const schema = zfd.formData({
    courseIds: zfd.repeatableOfType(zfd.text()),
  });
  const formBody = await request.json();

  const { courseIds } = schema.parse(formBody);

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

    const results = await db.collection(dbCollections.courses.name).deleteMany({
      _id: {
        $in: courseIds.map((i) => new BSON.ObjectId(i)),
      },
    });

    const response = {
      isError: false,
      results,
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

export async function findCourseByName_(request: any) {
  const schema = zfd.formData({
    name: zfd.text(),
    skip: zfd.numeric().optional(),
    limit: zfd.numeric().optional(),
    withMetaData: zfd.text().optional(),
  });
  const params = request.nextUrl.searchParams;

  const { name, limit, skip, withMetaData } = schema.parse(params);
  const isWithMetaData = withMetaData == 'true';

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
    const regexPattern = new RegExp(name, 'i');
    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    let courses = null;

    if (isWithMetaData) {
      courses = await db
        .collection(dbCollections.courses.name)
        .aggregate(
          p_fetchCoursesWithMetaData({
            project,
            query: {
              name: { $regex: regexPattern },
            },
            limit,
            skip,
          }),
        )
        .toArray();
    } else {
      courses = await db
        .collection(dbCollections.courses.name)
        .find(
          {
            name: { $regex: regexPattern },
          },
          { limit, skip },
        )
        .toArray();
    }

    const response = {
      isError: false,
      courses,
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
