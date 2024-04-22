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
    withMetaData: zfd.text().optional(),
  });
  const params = request.nextUrl.searchParams;

  console.log('params', params);

  const { limit, skip, withMetaData } = schema.parse(params);
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

    if (isWithMetaData) {
      mediaContent = await db
        .collection(dbCollections.media_content.name)
        .aggregate(p_fetchMediaContentWithMetaData({ query: {} }))
        .toArray();
    } else {
      mediaContent = await db
        .collection(dbCollections.media_content.name)
        .find(
          {},
          {
            limit: _limit,
            skip: _skip,
          },
        )
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
    skip: zfd.numeric(),
    limit: zfd.numeric(),
    withMetaData: zfd.text().optional(),
  });
  const formBody = await request.json();
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

    let mediaContent = null;

    if (isWithMetaData) {
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

export async function fetchRandomMediaContent_(request: any) {
  const schema = zfd.formData({
    limit: zfd.text(),
  });

  const params = request.nextUrl.searchParams;

  const { limit } = schema.parse(params);

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

    mediaContent = await db
      .collection(dbCollections.media_content.name)
      .aggregate(
        p_fetchRandomMediaContent({
          limit: _limit,
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
