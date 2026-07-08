import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { p_fetchProgramWithMetaData, p_fetchProgramsWithCreator } from './pipelines';
import { BSON } from 'mongodb';
import { z } from 'zod';
import { HttpStatusCode } from 'axios';
import { buildScopedQuery } from '../lib/organization';
import { Session } from 'next-auth';

export default async function fetchPrograms_(request: Request, session?: Session) {
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
      { includeLegacyUnscopedForDefault: true },
    );

    const programs = await db
      .collection(dbCollections.programs.name)
      .aggregate([{ $match: query }, ...p_fetchProgramsWithCreator(limit, skip)])
      .toArray();

    const response = {
      isError: false,
      programs,
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

export async function fetchProgramById_(request: Request, session?: Session) {
  const schema = zfd.formData({
    programId: zfd.text(),
    withMetaData: z.boolean(),
  });
  const formBody = await request.json();

  const { programId, withMetaData } = schema.parse(formBody);

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
      { _id: new BSON.ObjectId(programId) },
      { includeLegacyUnscopedForDefault: true },
    );

    let program;

    if (withMetaData) {
      program = await db
        .collection(dbCollections.programs.name)
        .aggregate(
          p_fetchProgramWithMetaData({
            query,
            limit: 1,
            skip: 0,
          }),
        )
        .toArray();

      program = program.length ? program[0] : null;
    } else {
      program = await db.collection(dbCollections.programs.name).findOne(query);
    }

    const response = {
      isError: false,
      program,
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

export async function deletePrograms_(request: Request) {
  const schema = zfd.formData({
    programIds: zfd.repeatableOfType(zfd.text()),
  });
  const formBody = await request.json();

  const { programIds } = schema.parse(formBody);

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

    const results = await db.collection(dbCollections.programs.name).deleteMany({
      _id: {
        $in: programIds.map((i) => new BSON.ObjectId(i)),
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

export async function findProgramsByName_(request: Request, session?: Session) {
  const schema = zfd.formData({
    name: zfd.text(),
    skip: zfd.numeric(),
    limit: zfd.numeric(),
    withMetaData: z.boolean(),
  });
  const formBody = await request.json();

  const { name, limit, skip, withMetaData } = schema.parse(formBody);

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

    let programs = null;

    if (withMetaData) {
      programs = await db
        .collection(dbCollections.programs.name)
        .aggregate(
          p_fetchProgramWithMetaData({
            query,
            skip: skip || 0,
            limit: limit || 20,
          }),
        )
        .toArray();
    } else {
      programs = await db.collection(dbCollections.programs.name).find(query, { skip, limit }).toArray();
    }

    const response = {
      isError: false,
      programs,
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
