import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { zfd } from 'zod-form-data';
import { getDbFieldNamesConfigStatus } from '../config';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { SUBJECT_FIELD_NAMES_CONFIG } from './constants';
import { p_fetchSubjectWithGrade, p_findSubjectByName } from './pipelines';
import { BSON } from 'mongodb';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';
import { sortByNumericValue } from '../utils/sorting';

const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 300000;

export default async function fetchSubjects_(request: any) {
  const schema = zfd.formData({
    limit: zfd.numeric().optional(),
    skip: zfd.numeric().optional(),
    withMetaData: zfd.text().default('true').optional(),
  });
  const params = request.nextUrl.searchParams;
  const queryKey = params.toString();

  if (cache[queryKey] && Date.now() - cache[queryKey].timestamp < CACHE_TTL) {
    return new NextResponse(JSON.stringify({ isError: false, subjects: cache[queryKey].data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });
  }

  const { limit, skip, withMetaData } = schema.parse(params);
  const isWithMetaData = withMetaData === 'true';

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

    let subjects = [];

    const dbConfigData = SUBJECT_FIELD_NAMES_CONFIG;

    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    if (isWithMetaData) {
      subjects = await db
        .collection(dbCollections.subjects.name)
        .aggregate(p_fetchSubjectWithGrade({ skip, limit, project }))
        .toArray();
    } else {
      subjects = await db
        .collection(dbCollections.subjects.name)
        .find(
          {},
          {
            limit,
            skip,
          },
        )
        .toArray();
    }

    cache[queryKey] = { data: subjects, timestamp: Date.now() };

    const response = {
      isError: false,
      subjects: sortByNumericValue(subjects, 'name'),
    };

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
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

export async function findSubjectByName_(request: any) {
  const schema = zfd.formData({
    name: zfd.text(),
    skip: zfd.numeric().optional(),
    limit: zfd.numeric().optional(),
  });
  const params = request.nextUrl.searchParams;

  const { name, limit, skip } = schema.parse(params);

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

    const subjects = await db
      .collection(dbCollections.subjects.name)
      .aggregate(p_findSubjectByName({ name, limit, skip }))
      .toArray();

    const response = {
      isError: false,
      subjects: sortByNumericValue(subjects, 'name'),
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

export async function fetchSubjectsByGradeId_(request: any) {
  const schema = zfd.formData({
    gradeId: zfd.text(),
    skip: zfd.numeric().optional(),
    limit: zfd.numeric().optional(),
  });
  const params = request.nextUrl.searchParams;

  const { gradeId, limit, skip } = schema.parse(params);

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

    const subjects = await db
      .collection(dbCollections.subjects.name)
      .find(
        {
          grade_id: new BSON.ObjectId(gradeId),
        },
        { skip, limit },
      )
      .toArray();

    const response = {
      isError: false,
      subjects: sortByNumericValue(subjects, 'name'),
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
