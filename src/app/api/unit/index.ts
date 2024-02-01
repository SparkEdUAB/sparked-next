import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import { BSON } from "mongodb";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { dbClient } from "../lib/db";
import { dbCollections } from "../lib/db/collections";
import { p_fetchUnitsWithMetaData } from "./pipelines";

export default async function fetchUnits_(request: Request) {
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

    let units = [];

    if (withMetaData) {
      units = await db
        .collection(dbCollections.units.name)
        .aggregate(p_fetchUnitsWithMetaData({ query: {} }))
        .toArray();
    } else {
      units = await db
        .collection(dbCollections.units.name)
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
      units,
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

export async function fetchUnitById_(request: Request) {
  const schema = zfd.formData({
    unitId: zfd.text(),
    withMetaData: z.boolean(),
  });
  const formBody = await request.json();

  const { unitId, withMetaData } = schema.parse(formBody);

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

    let unit: { [key: string]: string } | null;

    if (withMetaData) {
      const units = await db
        .collection(dbCollections.units.name)
        .aggregate(
          p_fetchUnitsWithMetaData({
            query: {
              _id: new BSON.ObjectId(unitId),
            },
          })
        )
        .toArray();

      unit = units.length ? units[0] : {};
    } else {
      unit = await db
        .collection(dbCollections.units.name)
        .findOne({ _id: new BSON.ObjectId(unitId) });
    }


    const response = {
      isError: false,
      unit,
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

export async function deleteUnits_(request: Request) {
  const schema = zfd.formData({
    unitIds: zfd.repeatableOfType(zfd.text()),
  });
  const formBody = await request.json();

  const { unitIds } = schema.parse(formBody);

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

    const results = await db.collection(dbCollections.units.name).deleteMany({
      _id: {
        $in: unitIds.map((i) => new BSON.ObjectId(i)),
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

export async function findUnitsByName_(request: Request) {
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

    let courses = null;

    if (withMetaData) {
      courses = await db
        .collection(dbCollections.units.name)
        .aggregate(
          p_fetchUnitsWithMetaData({
            query: {
              name: { $regex: regexPattern },
            },
          })
        )
        .toArray();
    } else {
      courses = await db
        .collection(dbCollections.units.name)
        .find({
          name: { $regex: regexPattern },
        })
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
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}
