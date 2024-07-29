import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { p_fetchProgramWithMetaData, p_fetchProgramsWithCreator } from './pipelines';
import { BSON } from 'mongodb';
import { z } from 'zod';

export default async function fetchPrograms_(request: Request) {
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
        status: 200,
      });
    }

    const programs = await db
      .collection(dbCollections.programs.name)
      .aggregate(p_fetchProgramsWithCreator(limit, skip))
      .toArray();

    const response = {
      isError: false,
      programs,
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

export async function fetchProgramById_(request: Request) {
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
        status: 200,
      });
    }

    let program;

    if (withMetaData) {
      program = await db
        .collection(dbCollections.programs.name)
        .aggregate(
          p_fetchProgramWithMetaData({
            query: {
              _id: new BSON.ObjectId(programId),
            },
            limit: 1,
            skip: 0,
          }),
        )
        .toArray();

      program = program.length ? program[0] : null;
    } else {
      program = await db.collection(dbCollections.programs.name).findOne({ _id: new BSON.ObjectId(programId) });
    }

    const response = {
      isError: false,
      program,
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
        status: 200,
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

export async function findProgramsByName_(request: Request) {
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
        status: 200,
      });
    }
    const regexPattern = new RegExp(name, 'i');

    let programs = null;

    if (withMetaData) {
      programs = await db
        .collection(dbCollections.programs.name)
        .aggregate(
          p_fetchProgramWithMetaData({
            query: {
              name: { $regex: regexPattern },
            },
            skip: skip || 0,
            limit: limit || 20,
          }),
        )
        .toArray();
    } else {
      programs = await db
        .collection(dbCollections.programs.name)
        .find(
          {
            name: { $regex: regexPattern },
          },
          { skip, limit },
        )
        .toArray();
    }

    const response = {
      isError: false,
      programs,
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
