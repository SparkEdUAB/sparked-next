import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { p_fetchTopicsWithMetaData } from './pipelines';
import { TOPIC_FIELD_NAMES_CONFIG } from './constants';
import { getDbFieldNamesConfigStatus } from '../config';

const dbConfigData = TOPIC_FIELD_NAMES_CONFIG;

export default async function fetchTopics_(request: any) {
  const schema = zfd.formData({
    limit: zfd.numeric(),
    skip: zfd.numeric(),
    withMetaData: zfd.text().optional(),
  });
  const params = request.nextUrl.searchParams;

  const { limit, skip, withMetaData } = schema.parse(params);
  const isWithMetaData = Boolean(withMetaData);

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
    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    let topics = [];

    if (isWithMetaData) {
      topics = await db
        .collection(dbCollections.topics.name)
        .aggregate(p_fetchTopicsWithMetaData({ query: {}, project }))
        .toArray();
    } else {
      topics = await db
        .collection(dbCollections.topics.name)
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
      topics,
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

export async function fetchTopicById_(request: any) {
  const schema = zfd.formData({
    topicId: zfd.text(),
    withMetaData: zfd.text().optional(),
  });
  const params = request.nextUrl.searchParams;

  const { topicId, withMetaData } = schema.parse(params);
  const isWithMetaData = Boolean(withMetaData);

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
    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    let topic: { [key: string]: string } | null;

    if (isWithMetaData) {
      const topics = await db
        .collection(dbCollections.topics.name)
        .aggregate(
          p_fetchTopicsWithMetaData({
            project,
            query: {
              _id: new BSON.ObjectId(topicId),
            },
          }),
        )
        .toArray();

      topic = topics.length ? topics[0] : {};
    } else {
      topic = await db.collection(dbCollections.topics.name).findOne({ _id: new BSON.ObjectId(topicId) });
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
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}

export async function deleteTopics_(request: Request) {
  const schema = zfd.formData({
    topicIds: zfd.repeatableOfType(zfd.text()),
  });
  const formBody = await request.json();

  const { topicIds } = schema.parse(formBody);

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

    const results = await db.collection(dbCollections.topics.name).deleteMany({
      _id: {
        $in: topicIds.map((i) => new BSON.ObjectId(i)),
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

export async function findTopicsByName_(request: any) {
  const schema = zfd.formData({
    name: zfd.text(),
    skip: zfd.numeric().optional(),
    limit: zfd.numeric().default(20).optional(),
    withMetaData: zfd.text().optional(),
  });
  const params = request.nextUrl.searchParams;

  const { name, limit, skip, withMetaData } = schema.parse(params);
  const isWithMetaData = Boolean(withMetaData);

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
    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    let topics = null;

    if (isWithMetaData) {
      topics = await db
        .collection(dbCollections.topics.name)
        .aggregate(
          p_fetchTopicsWithMetaData({
            project,
            query: {
              name: { $regex: regexPattern },
            },
          }),
        )
        .toArray();
    } else {
      topics = await db
        .collection(dbCollections.topics.name)
        .find({
          name: { $regex: regexPattern },
        })
        .toArray();
    }

    const response = {
      isError: false,
      topics,
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
