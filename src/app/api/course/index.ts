import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import { BSON } from "mongodb";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { dbClient } from "../lib/db";
import { dbCollections } from "../lib/db/collections";
import { p_fetchCoursesWithMetaData } from "./pipelines";

export default async function fetchCourses_(request: Request) {
  const schema = zfd.formData({
    limit: zfd.numeric(),
    skip: zfd.numeric(),
    withMetaData: z.boolean().optional(),
  });
  const formBody = await request.json();

  const { limit, skip, withMetaData } = schema.parse(formBody);

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

    let courses = [];

    if (withMetaData) {
      courses = await db
        .collection(dbCollections.courses.name)
        .aggregate(p_fetchCoursesWithMetaData({ query: {} }))
        .toArray();
    } else {
      courses = await db
        .collection(dbCollections.courses.name)
        .find(
          {},
          {
            limit,
            skip,
          }
        )
        .toArray();
    }

    const response = {
      isError: false,
      courses,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKOWN_ERROR,
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
          p_fetchCoursesWithMetaData({
            query: {
              _id: new BSON.ObjectId(programId),
            },
          })
        )
        .toArray();

      program = program.length ? program[0] : null;
    } else {
      program = await db
        .collection(dbCollections.programs.name)
        .findOne({ _id: new BSON.ObjectId(programId) });
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
      code: SPARKED_PROCESS_CODES.UNKOWN_ERROR,
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

    const results = await db
      .collection(dbCollections.programs.name)
      .deleteMany({
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
      code: SPARKED_PROCESS_CODES.UNKOWN_ERROR,
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
    const regexPattern = new RegExp(name, "i");

    let programs = null;

    if (withMetaData) {
      programs = await db
        .collection(dbCollections.programs.name)
        .aggregate(
          p_fetchCoursesWithMetaData({
            query: {
              name: { $regex: regexPattern },
            },
          })
        )
        .toArray();
    } else {
      programs = await db
        .collection(dbCollections.programs.name)
        .find({
          name: { $regex: regexPattern },
        })
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
      code: SPARKED_PROCESS_CODES.UNKOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}
