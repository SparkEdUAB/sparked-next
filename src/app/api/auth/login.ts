import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import AUTH_PROCESS_CODES from './processCodes';
import jwt from 'jsonwebtoken';
import { p_fetchUserRoleDetails } from './pipelines';
import { T_RECORD } from 'types';
import { HttpStatusCode } from 'axios';
import bcrypt from 'bcryptjs';

const CACHE_TTL = 300000; // 5 minutes
const userCache = new Map();

// Add caching to user lookup
const getCachedUser = async (email: string, db: any) => {
  const cacheKey = `user_${email}`;
  const cached = userCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const user = await db.collection(dbCollections.users.name).findOne({ email });
  if (user) {
    userCache.set(cacheKey, {
      data: user,
      timestamp: Date.now(),
    });
  }

  return user;
};

// Add at the top of the file to debug env vars
console.log('Environment check:', {
  hasUri: !!process.env.MONGODB_URI,
  hasDbName: !!process.env.MONGODB_DB,
  hasJwtSecret: !!process.env.JWT_SECRET,
});

export default async function login_(request: Request) {
  const startTime = performance.now();

  const schema = zfd.formData({
    email: zfd.text(),
    password: zfd.text(),
  });

  const formBody = await request.json();

  const { email, password } = schema.parse(formBody);

  try {
    // Add connection debugging
    console.log('Connecting to database...');
    const db = await dbClient();
    console.log('Database connection result:', {
      connected: !!db,
      uri: process.env.MONGODB_URI?.substring(0, 20) + '...', // Only log part of the URI for security
      dbName: process.env.MONGODB_DB,
    });

    console.log('====================================');
    console.log('db log@@', db, email, password);
    console.log('====================================');

    if (!db) {
      const response = {
        isError: true,
        code: AUTH_PROCESS_CODES.UNKNOWN_ERROR,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.InternalServerError,
      });
    }

    const user = await getCachedUser(email, db);

    console.log('====================================');
    console.log('db log@@', user);
    console.log('====================================');

    if (!user) {
      const response = {
        isError: true,
        code: AUTH_PROCESS_CODES.USER_NOT_FOUND,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const response = {
        isError: true,
        code: AUTH_PROCESS_CODES.INVALID_CREDENTIALS,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.Unauthorized,
      });
    }

    // Combine user and role queries into single aggregation
    const userWithRole = await db
      .collection(dbCollections.users.name)
      .aggregate([
        { $match: { email } },
        {
          $lookup: {
            from: dbCollections.user_role_mappings.name,
            localField: '_id',
            foreignField: 'user_id',
            as: 'role_mapping',
          },
        },
        {
          $lookup: {
            from: dbCollections.user_roles.name,
            localField: 'role_mapping.role_id',
            foreignField: '_id',
            as: 'role',
          },
        },
      ])
      .toArray();

    let role: null | T_RECORD = null;

    if (userWithRole[0]?.role[0]) {
      role = {
        id: userWithRole[0].role[0]._id,
        name: userWithRole[0].role[0].name,
      };
    }

    const token = jwt.sign({ id: user._id, email: user.email, role }, process.env.JWT_SECRET as string, {
      expiresIn: '72h',
    });

    const response = {
      isError: false,
      code: AUTH_PROCESS_CODES.USER_LOGGED_IN_OK,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: role?.name,
      },
      jwtToken: token,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch (error) {
    console.error('Login error:', error);
    const resp = {
      isError: true,
      code: AUTH_PROCESS_CODES.INVALID_CREDENTIALS,
      error: error.message,
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.BadRequest,
    });
  } finally {
    const duration = performance.now() - startTime;
    console.log(`Login attempt took ${duration}ms`);
  }
}
