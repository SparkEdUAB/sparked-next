import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { p_fetchMediaContentWithMetaData, p_fetchRandomMediaContent, p_fetchRelatedMediaContent } from './pipelines';
import { MEDIAL_CONTENT_FIELD_NAMES_CONFIG } from './constants';
import { getDbFieldNamesConfigStatus } from '../config';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { revalidateTag } from 'next/cache';

const dbConfigData = MEDIAL_CONTENT_FIELD_NAMES_CONFIG;

// Add cache configuration
const CACHE_TAG_MEDIA = 'media-content';

const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 300000; // Cache expiry time in milliseconds (5 min)

export default async function fetchMediaContent_(request: any) {
  const schema = zfd.formData({
    limit: zfd.text(),
    skip: zfd.text(),
    withMetaData: zfd.text().optional(),
    grade_id: z.string().optional(),
    subject_id: z.string().optional(),
    school_id: z.string().optional(),
    program_id: z.string().optional(),
    course_id: z.string().optional(),
    unit_id: z.string().optional(),
    topic_id: z.string().optional(),
  });

  const params = request.nextUrl.searchParams;
  const queryKey = params.toString(); // Generate a unique cache key

  // Check if data is cached and still valid
  if (cache[queryKey] && Date.now() - cache[queryKey].timestamp < CACHE_TTL) {
    return new NextResponse(JSON.stringify({ isError: false, mediaContent: cache[queryKey].data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });
  }

  const { limit, skip, withMetaData, school_id, program_id, course_id, unit_id, topic_id, subject_id, grade_id } =
    schema.parse(params);

  const isWithMetaData = withMetaData == 'true';
  const _limit = parseInt(limit);
  const _skip = parseInt(skip);

  try {
    const db = await dbClient();

    if (!db) {
      return new NextResponse(JSON.stringify({ isError: true, code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED }), {
        status: 500,
      });
    }

    let mediaContent = [];
    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    let query: { [key: string]: BSON.ObjectId } = {};

    if (grade_id) query.grade_id = new BSON.ObjectId(grade_id);
    if (subject_id) query.subject_id = new BSON.ObjectId(subject_id);
    if (school_id) query.school_id = new BSON.ObjectId(school_id);
    if (program_id) query.program_id = new BSON.ObjectId(program_id);
    if (course_id) query.course_id = new BSON.ObjectId(course_id);
    if (unit_id) query.unit_id = new BSON.ObjectId(unit_id);
    if (topic_id) query.topic_id = new BSON.ObjectId(topic_id);

    if (isWithMetaData) {
      mediaContent = await db
        .collection(dbCollections.media_content.name)
        .aggregate(p_fetchMediaContentWithMetaData({ query, project }))
        .toArray();
    } else {
      mediaContent = await db
        .collection(dbCollections.media_content.name)
        .find(query, { limit: _limit, skip: _skip })
        .toArray();
    }

    // Store in cache
    cache[queryKey] = { data: mediaContent, timestamp: Date.now() };

    return new NextResponse(JSON.stringify({ isError: false, mediaContent }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });
  } catch {
    return new NextResponse(JSON.stringify({ isError: true, code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR }), {
      status: 500,
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
  const isWithMetaData = withMetaData == 'true';

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

    let mediaContent: { [key: string]: string } | null;
    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    if (isWithMetaData) {
      const mediaContentList = await db
        .collection(dbCollections.media_content.name)
        .aggregate(
          p_fetchMediaContentWithMetaData({
            project,
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
        status: HttpStatusCode.InternalServerError,
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

export async function findMediaContentByName_(request: any) {
  const schema = zfd.formData({
    name: zfd.text(),
    skip: zfd.numeric(),
    limit: zfd.numeric(),
    // withMetaData: z.boolean(),
    school_id: z.string().optional(),
    program_id: z.string().optional(),
    course_id: z.string().optional(),
    unit_id: z.string().optional(),
    topic_id: z.string().optional(),
  });
  // const formBody = await request.json();
  const params = request.nextUrl.searchParams;

  const { name, limit, skip, school_id, program_id, course_id, unit_id, topic_id } = schema.parse(params);

  const isWithMetaData = params.withMetaData == 'true' ? true : false;

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

    let mediaContent = null;

    let query: { [key: string]: BSON.ObjectId } = {};

    if (school_id) query.school_id = new BSON.ObjectId(school_id);
    if (program_id) query.program_id = new BSON.ObjectId(program_id);
    if (course_id) query.course_id = new BSON.ObjectId(course_id);
    if (unit_id) query.unit_id = new BSON.ObjectId(unit_id);
    if (topic_id) query.topic_id = new BSON.ObjectId(topic_id);
    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    if (isWithMetaData) {
      mediaContent = await db
        .collection(dbCollections.media_content.name)
        .aggregate(
          p_fetchMediaContentWithMetaData({
            project,
            query: {
              name: { $regex: regexPattern },
              ...query,
            },
            limit,
            skip,
          }),
        )
        .toArray();
    } else {
      mediaContent = await db
        .collection(dbCollections.media_content.name)
        .find(
          {
            name: { $regex: regexPattern },
            ...query,
          },
          { limit, skip },
        )
        .toArray();
    }

    const response = {
      isError: false,
      mediaContent,
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
        status: HttpStatusCode.InternalServerError,
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

export async function fetchRelatedMediaContent_(request: NextRequest) {
  const schema = zfd.formData({
    grade_id: zfd.text().optional(),
    media_content_id: zfd.text(), // Add media_content_id to exclude current content
    limit: zfd.text().optional(),
    skip: zfd.text().optional(),
  });

  const params = request.nextUrl.searchParams;
  const { limit, skip, grade_id, media_content_id } = schema.parse(params);
  const _limit = parseInt(limit || '10');
  const _skip = parseInt(skip || '0');

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

    const relatedMediaContent = await db
      .collection(dbCollections.media_content.name)
      .find(
        {
          grade_id: new BSON.ObjectId(grade_id),
          _id: { $ne: new BSON.ObjectId(media_content_id) }, // Exclude current media
        },
        {
          limit: _limit,
          skip: _skip,
        },
      )
      .toArray();

    const response = {
      isError: false,
      mediaContent: relatedMediaContent,
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

// Add a function to invalidate cache when needed
export async function invalidateMediaCache() {
  revalidateTag(CACHE_TAG_MEDIA);
}
