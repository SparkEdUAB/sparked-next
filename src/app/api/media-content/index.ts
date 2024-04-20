import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { p_fetchMediaContentWithMetaData, p_fetchRandomMediaContent } from './pipelines';

export default async function fetchMediaContent_(request: Request) {
  const schema = zfd.formData({
    limit: zfd.numeric(),
    skip: zfd.numeric(),
    withMetaData: z.boolean().optional(),
    school_id: z.string().optional(),
    program_id: z.string().optional(),
    course_id: z.string().optional(),
    unit_id: z.string().optional(),
    topic_id: z.string().optional(),
  });
  const formBody = await request.json();

  const { limit, skip, withMetaData, school_id, program_id, course_id, unit_id, topic_id } = schema.parse(formBody);

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

    if (withMetaData) {
      mediaContent = await db
        .collection(dbCollections.media_content.name)
        .aggregate(p_fetchMediaContentWithMetaData({ query }))
        .toArray();
    } else {
      mediaContent = await db
        .collection(dbCollections.media_content.name)
        .find(query, {
          limit,
          skip,
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

export async function fetchMediaContentById_(request: Request) {
  const schema = zfd.formData({
    mediaContentId: zfd.text(),
    withMetaData: z.boolean(),
  });
  const formBody = await request.json();

  const { mediaContentId, withMetaData } = schema.parse(formBody);

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

    if (withMetaData) {
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

export async function findMediaContentByName_(request: Request) {
  const schema = zfd.formData({
    name: zfd.text(),
    skip: zfd.numeric(),
    limit: zfd.numeric(),
    withMetaData: z.boolean(),
    school_id: z.string().optional(),
    program_id: z.string().optional(),
    course_id: z.string().optional(),
    unit_id: z.string().optional(),
    topic_id: z.string().optional(),
  });
  const formBody = await request.json();

  const { name, limit, skip, withMetaData, school_id, program_id, course_id, unit_id, topic_id } =
    schema.parse(formBody);

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

    if (withMetaData) {
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

export async function fetchRandomMediaContent_(request: Request) {
  const urlParams = new URLSearchParams(request.url.split('?')[1]);

  const limit = Number(urlParams.get('limit')) || 20;
  const school_id = urlParams.get('school_id');
  const program_id = urlParams.get('program_id');
  const course_id = urlParams.get('course_id');
  const unit_id = urlParams.get('unit_id');
  const topic_id = urlParams.get('topic_id');

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
          limit,
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
