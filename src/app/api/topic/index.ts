import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import { BSON } from "mongodb";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { dbClient } from "../lib/db";
import { dbCollections } from "../lib/db/collections";
import { p_fetchTopicsWithMetaData } from "./pipelines";

export default async function fetchTopics_(request: Request) {
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
        .collection(dbCollections.topics.name)
        .aggregate(p_fetchTopicsWithMetaData({ query: {} }))
        .toArray();
    } else {
      units = await db
        .collection(dbCollections.topics.name)
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
      code: SPARKED_PROCESS_CODES.UNKOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}

export async function fetchTopicById_(request: Request) {
  const schema = zfd.formData({
    topicId: zfd.text(),
    withMetaData: z.boolean(),
  });
  const formBody = await request.json();

  const { topicId, withMetaData } = schema.parse(formBody);

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

    let topic: { [key: string]: string } | null;

    if (withMetaData) {
      const topics = await db
        .collection(dbCollections.topics.name)
        .aggregate(
          p_fetchTopicsWithMetaData({
            query: {
              _id: new BSON.ObjectId(topicId),
            },
          })
        )
        .toArray();

      topic = topics.length ? topics[0] : {};
    } else {
      topic = await db
        .collection(dbCollections.topics.name)
        .findOne({ _id: new BSON.ObjectId(topicId) });
    }


    const response = {
      isError: false,
      topic,
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
      code: SPARKED_PROCESS_CODES.UNKOWN_ERROR,
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
          p_fetchTopicsWithMetaData({
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
      code: SPARKED_PROCESS_CODES.UNKOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}
