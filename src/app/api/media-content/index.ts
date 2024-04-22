import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { p_fetchMediaContentWithMetaData, p_fetchRandomMediaContent } from './pipelines';

export default async function fetchMediaContent_(request: any) {
  const schema = zfd.formData({
    limit: zfd.text(),
    skip: zfd.text(),
    withMetaData: z.boolean().optional(),
    school_id: z.string().optional(),
    program_id: z.string().optional(),
    course_id: z.string().optional(),
    unit_id: z.string().optional(),
    topic_id: z.string().optional(),
  });
  const params = request.nextUrl.searchParams;

  const { limit, skip, withMetaData, school_id, program_id, course_id, unit_id, topic_id } = schema.parse(params);
  const isWithMetaData = Boolean(withMetaData);
  const _limit = parseInt(limit);
  const _skip = parseInt(skip);
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

    let mediaContent = [];

    let query: { [key: string]: BSON.ObjectId } = {};

    if (school_id) query.school_id = new BSON.ObjectId(school_id);
    if (program_id) query.program_id = new BSON.ObjectId(program_id);
    if (course_id) query.course_id = new BSON.ObjectId(course_id);
    if (unit_id) query.unit_id = new BSON.ObjectId(unit_id);
    if (topic_id) query.topic_id = new BSON.ObjectId(topic_id);

    if (isWithMetaData) {
      mediaContent = await db
        .collection(dbCollections.media_content.name)
        .aggregate(p_fetchMediaContentWithMetaData({ query }))
        .toArray();
    } else {
      mediaContent = await db
        .collection(dbCollections.media_content.name)
        .find(query, {
          limit: _limit,
          skip: _skip,
        })
        .toArray();
    }

    const response = {
      isError: false,
      mediaContent,
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

export async function fetchMediaContentById_(request: any) {
  const schema = zfd.formData({
    mediaContentId: zfd.text(),
    withMetaData: zfd.text().optional(),
  });
  const params = request.nextUrl.searchParams;

  const { mediaContentId, withMetaData } = schema.parse(params);
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

    let mediaContent: { [key: string]: string } | null;

    if (isWithMetaData) {
      const mediaContentList = await db
        .collection(dbCollections.media_content.name)
        .aggregate(
          p_fetchMediaContentWithMetaData({
            query: {
              _id: new BSON.ObjectId(mediaContentId),
            },
          }),
        )
        .toArray();

      mediaContent = mediaContentList.length ? mediaContentList[0] : {};
    } else {
      mediaContent = await db
        .collection(dbCollections.media_content.name)
        .findOne({ _id: new BSON.ObjectId(mediaContentId) });
    }

    const response = {
      isError: false,
      mediaContent,
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

export async function deleteMediaContentByIds_(request: Request) {
  const schema = zfd.formData({
    mediaContentIds: zfd.repeatableOfType(zfd.text()),
  });
  const formBody = await request.json();

  const { mediaContentIds } = schema.parse(formBody);

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

    const results = await db.collection(dbCollections.media_content.name).deleteMany({
      _id: {
        $in: mediaContentIds.map((i) => new BSON.ObjectId(i)),
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

export async function findMediaContentByName_(request: any) {
  const schema = zfd.formData({
    name: zfd.text(),
    skip: zfd.text(),
    limit: zfd.text(),
    withMetaData: z.boolean(),
    school_id: z.string().optional(),
    program_id: z.string().optional(),
    course_id: z.string().optional(),
    unit_id: z.string().optional(),
    topic_id: z.string().optional(),
  });
  const formBody = await request.json();
  const params = request.nextUrl.searchParams;

  const { name, limit, skip, withMetaData, school_id, program_id, course_id, unit_id, topic_id } =
    schema.parse(formBody);
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

    let mediaContent = null;

    let query: { [key: string]: BSON.ObjectId } = {};

    if (school_id) query.school_id = new BSON.ObjectId(school_id);
    if (program_id) query.program_id = new BSON.ObjectId(program_id);
    if (course_id) query.course_id = new BSON.ObjectId(course_id);
    if (unit_id) query.unit_id = new BSON.ObjectId(unit_id);
    if (topic_id) query.topic_id = new BSON.ObjectId(topic_id);

    if (isWithMetaData) {
      mediaContent = await db
        .collection(dbCollections.media_content.name)
        .aggregate(
          p_fetchMediaContentWithMetaData({
            query: {
              name: { $regex: regexPattern },
              ...query,
            },
          }),
        )
        .toArray();
    } else {
      mediaContent = await db
        .collection(dbCollections.media_content.name)
        .find({
          name: { $regex: regexPattern },
          ...query,
        })
        .toArray();
    }

    const response = {
      isError: false,
      mediaContent,
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

export async function fetchRandomMediaContent_(request: any) {
  const schema = zfd.formData({
    limit: zfd.text(),
    school_id: zfd.text().optional(),
    program_id: zfd.text().optional(),
    course_id: zfd.text().optional(),
    unit_id: zfd.text().optional(),
    topic_id: zfd.text().optional(),
  });

  const params = request.nextUrl.searchParams;

  const { limit, school_id, program_id, course_id, unit_id, topic_id } = schema.parse(params);

  const _limit = parseInt(limit);

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

    let mediaContent = null;

    let query: { [key: string]: BSON.ObjectId } = {};

    if (school_id) query.school_id = new BSON.ObjectId(school_id);
    if (program_id) query.program_id = new BSON.ObjectId(program_id);
    if (course_id) query.course_id = new BSON.ObjectId(course_id);
    if (unit_id) query.unit_id = new BSON.ObjectId(unit_id);
    if (topic_id) query.topic_id = new BSON.ObjectId(topic_id);

    mediaContent = await db
      .collection(dbCollections.media_content.name)
      .aggregate(
        p_fetchRandomMediaContent({
          limit: _limit,
          query,
        }),
      )
      .toArray();

    const response = {
      isError: false,
      mediaContent,
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
