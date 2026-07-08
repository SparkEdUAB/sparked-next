import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import AUTH_PROCESS_CODES from './processCodes';
import jwt from 'jsonwebtoken';
import { p_fetchUserRoleDetails } from './pipelines';
import { T_RECORD } from 'types';
import { HttpStatusCode } from 'axios';
import bcrypt from 'bcryptjs';
import { resolveOrganizationContext } from '../lib/organization';
import { Session } from 'next-auth';

export default async function login_(request: Request) {
  const schema = zfd.formData({
    email: zfd.text(),
    password: zfd.text(),
  });

  const formBody = await request.json();

  const { email, password } = schema.parse(formBody);

  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: AUTH_PROCESS_CODES.UNKNOWN_ERROR,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.InternalServerError,
      });
    }

    const user = await db.collection(dbCollections.users.name).findOne(
      {
        email,
      },
      {
        projection: {
          email: 1,
          _id: 1,
          role: 1,
          is_verified: 1,
          password: 1,
          firstName: 1,
          lastName: 1,
          phoneNumber: 1,
          organization_id: 1,
          institution_id: 1,
        },
      },
    );

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

    const userRole = await db
      .collection(dbCollections.user_role_mappings.name)
      .aggregate(p_fetchUserRoleDetails({ userId: `${user._id}` }))
      .toArray();

    let role: null | T_RECORD = null;

    if (userRole[0]) {
      role = {
        id: userRole[0].role_details._id,
        name: userRole[0].role_details.name,
      };
    }

    const organizationContext = await resolveOrganizationContext(db, {
      session: {
        expires: new Date(Date.now() + 60_000).toISOString(),
        user: {
          id: user._id.toString(),
          role: typeof role?.name === 'string' ? role.name : undefined,
        },
      } as Session,
      organizationId: user.organization_id?.toString?.() || user.institution_id?.toString?.(),
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phoneNumber,
        organizationId: organizationContext.organizationId,
        organizationSlug: organizationContext.organizationSlug,
        organizationType: organizationContext.organizationType,
        isDefaultOrganization: organizationContext.isDefaultOrganization,
        isPlatformAdmin: organizationContext.isPlatformAdmin,
      },
      process.env.JWT_SECRET as string,
      {
      expiresIn: '72h',
      },
    );

    const response = {
      isError: false,
      code: AUTH_PROCESS_CODES.USER_LOGGED_IN_OK,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: role?.name,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        organizationId: organizationContext.organizationId,
        organizationSlug: organizationContext.organizationSlug,
        organizationType: organizationContext.organizationType,
        isDefaultOrganization: organizationContext.isDefaultOrganization,
        isPlatformAdmin: organizationContext.isPlatformAdmin,
      },
      jwtToken: token,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch {
    const resp = {
      isError: true,
      code: AUTH_PROCESS_CODES.INVALID_CREDENTIALS,
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.BadRequest,
    });
  }
}
