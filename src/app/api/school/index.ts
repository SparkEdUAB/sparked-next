import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { p_fetchSchoolsWithCreator } from './pipelines';
import { BSON } from 'mongodb';
import { HttpStatusCode } from 'axios';
import { buildScopedQuery } from '../lib/organization';
import { Session } from 'next-auth';

export default async function fetchSchools_(request: Request, session?: Session) {
  const schema = zfd.formData({
    limit: zfd.numeric(),
    skip: zfd.numeric(),
  });
  const formBody = await request.json();

  const { limit, skip } = schema.parse(formBody);

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

    const query = await buildScopedQuery(
      db,
      session,
      {},
      {
        includeLegacyUnscopedForDefault: true,
      },
    );

    const schools = await db
      .collection(dbCollections.schools.name)
      .aggregate([{ $match: query }, ...p_fetchSchoolsWithCreator(limit, skip)])
      .toArray();

    const response = {
      isError: false,
      schools,
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

export async function fetchSchool_(request: Request, session?: Session) {
  const schema = zfd.formData({
    schoolId: zfd.text(),
  });
  const formBody = await request.json();

  const { schoolId } = schema.parse(formBody);

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

    const query = await buildScopedQuery(
      db,
      session,
      { _id: new BSON.ObjectId(schoolId) },
      { includeLegacyUnscopedForDefault: true },
    );

    const school = await db.collection(dbCollections.schools.name).findOne(query);

    const response = {
      isError: false,
      school,
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

export async function deleteSchools_(request: Request) {
  const schema = zfd.formData({
    schoolIds: zfd.repeatableOfType(zfd.text()),
  });
  const formBody = await request.json();

  const { schoolIds } = schema.parse(formBody);

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

    const results = await db.collection(dbCollections.schools.name).deleteMany({
      _id: {
        $in: schoolIds.map((i) => new BSON.ObjectId(i)),
      },
    });

    const response = {
      isError: false,
      results,
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

export async function findSchoolsByName_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    skip: zfd.numeric(),
    limit: zfd.numeric(),
  });
  const formBody = await request.json();

  const { name, limit, skip } = schema.parse(formBody);

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

    const query = await buildScopedQuery(
      db,
      session,
      {
        name: { $regex: regexPattern },
      },
      { includeLegacyUnscopedForDefault: true },
    );

    const schools = await db
      .collection(dbCollections.schools.name)
      .find(query, { limit, skip })
      .toArray();

    const response = {
      isError: false,
      schools,
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
