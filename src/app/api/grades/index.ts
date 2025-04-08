import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

// Add cache configuration
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 300000; // Cache expiry time in milliseconds (5 min)

export default async function fetchGrades_(request: any) {
  const schema = zfd.formData({
    limit: zfd.numeric().default(50),
    skip: zfd.numeric().default(0),
  });
  const params = request.nextUrl.searchParams;
  const queryKey = params.toString(); // Generate a unique cache key

  // Check if data is cached and still valid
  if (cache[queryKey] && Date.now() - cache[queryKey].timestamp < CACHE_TTL) {
    return new NextResponse(JSON.stringify({ isError: false, grades: cache[queryKey].data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });
  }

  const { limit, skip } = schema.parse(params);

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

    const grades = await db
      .collection(dbCollections.grades.name)
      .find(
        {},
        {
          limit,
          skip,
        },
      )
      .toArray();

    // Store in cache
    cache[queryKey] = { data: grades, timestamp: Date.now() };

    const response = {
      isError: false,
      grades,
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

export async function fetchGradeById_(request: any) {
  const schema = zfd.formData({
    gradeId: zfd.text(),
    withMetaData: zfd.text(),
  });
  const params = request.nextUrl.searchParams;
  const queryKey = `grade_${params.get('gradeId')}`; // Generate a unique cache key

  // Check if data is cached and still valid
  if (cache[queryKey] && Date.now() - cache[queryKey].timestamp < CACHE_TTL) {
    return new NextResponse(JSON.stringify({ isError: false, grade: cache[queryKey].data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });
  }

  const { gradeId } = schema.parse(params);

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
    const grade = await db.collection(dbCollections.grades.name).findOne({ _id: new BSON.ObjectId(gradeId) });

    // Store in cache
    cache[queryKey] = { data: grade, timestamp: Date.now() };

    const response = {
      isError: false,
      grade,
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

export async function deleteGrade_(request: Request) {
  // For delete operations, we should invalidate the cache
  const formBody = await request.json();
  const { gradeIds } = formBody;

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

    const results = await db.collection(dbCollections.grades.name).deleteMany({
      _id: {
        $in: gradeIds.map((i: any) => new BSON.ObjectId(i)),
      },
    });

    // Clear the entire cache since we don't know which entries might be affected
    Object.keys(cache).forEach((key) => {
      if (key.startsWith('grade_') || key.includes('grades')) {
        delete cache[key];
      }
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

export async function findGradeByName_(request: any) {
  const schema = zfd.formData({
    name: zfd.text(),
    skip: zfd.numeric().optional(),
    limit: zfd.numeric().optional(),
    withMetaData: zfd.text().default('false'),
  });
  const params = request.nextUrl.searchParams;
  const queryKey = `grade_search_${params.toString()}`; // Generate a unique cache key

  // Check if data is cached and still valid
  if (cache[queryKey] && Date.now() - cache[queryKey].timestamp < CACHE_TTL) {
    return new NextResponse(JSON.stringify({ isError: false, grades: cache[queryKey].data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });
  }

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
    const regexPattern = new RegExp(name, 'i');

    const grades = await db
      .collection(dbCollections.grades.name)
      .find(
        {
          name: { $regex: regexPattern },
        },
        { limit, skip },
      )
      .toArray();

    // Store in cache
    cache[queryKey] = { data: grades, timestamp: Date.now() };

    const response = {
      isError: false,
      grades,
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
