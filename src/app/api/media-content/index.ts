import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { p_fetchMediaContentWithMetaData, p_fetchRandomMediaContent } from './pipelines';
// import { NextApiRequest, NextApiResponse } from 'next';

export default async function fetchMediaContent_(req: Request) {
  if (req.method !== 'GET') {
    // Method Not Allowed
    return Response.json({ message: 'Method Not Allowed' });
  }

  const schema = z.object({
    limit: z.number().optional(),
    skip: z.number().optional(),
    withMetaData: z.boolean().optional(),
  });

  // const { limit, skip, withMetaData } = req.query; //schema.parse(req.query);

  console.log('=======================fetchMediaContent_ =================================');
  // console.log(res.json({}));
  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
      };
      return Response.json(response);
      // return res.status(200).json(response);
    }
    let mediaContent = [];

    mediaContent = await db.collection(dbCollections.media_content.name).find({}).toArray();

    const response = {
      isError: false,
      mediaContent,
    };

    // return res.status(200).json(response);
    return Response.json(response);
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return Response.json(resp);
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

    let mediaContent = null;

    if (withMetaData) {
      mediaContent = await db
        .collection(dbCollections.media_content.name)
        .aggregate(
          p_fetchMediaContentWithMetaData({
            query: {
              name: { $regex: regexPattern },
            },
          }),
        )
        .toArray();
    } else {
      mediaContent = await db
        .collection(dbCollections.media_content.name)
        .find({
          name: { $regex: regexPattern },
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
  const schema = zfd.formData({
    limit: zfd.numeric(),
  });

  const formBody = request.text();

  // let { limit } = schema.parse(formBody);

  const limit = 1000;

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

    mediaContent = await db
      .collection(dbCollections.media_content.name)
      .aggregate(
        p_fetchRandomMediaContent({
          limit,
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
