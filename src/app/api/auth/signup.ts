import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { z } from 'zod';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import AUTH_PROCESS_CODES from './processCodes';
import { HttpStatusCode } from 'axios';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import { WelcomeEmail } from 'emails/WelcomeEmail';
import { BSON } from 'mongodb';
import { listActiveOrganizations, normalizeOrganizationPayload } from '../lib/organization';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function signup_(request: Request) {
  const schema = z.object({
    email: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string(),
    isStudent: z.boolean().default(true),
    institutionType: z.string().optional(),
    schoolName: z.string().optional().default(''),
    grade: z.any().optional().default(0),
    organizationId: z.string().optional(),
    institutionId: z.string().optional(),
    institutionName: z.string().optional(),
  });

  const formBody = await request.json();
  const {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    isStudent,
    institutionType,
    schoolName,
    grade,
    institutionId,
    organizationId,
  } =
    schema.parse(formBody);

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

    const user = await db.collection(dbCollections.users.name).findOne({
      email,
    });

    if (user) {
      const response = {
        isError: true,
        code: AUTH_PROCESS_CODES.USER_ALREADY_EXIST,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    const activeOrganizations = await listActiveOrganizations(db);
    const requestedOrganizationId = organizationId || institutionId || (activeOrganizations.length === 1 ? activeOrganizations[0]?._id.toString() : undefined);

    if (!requestedOrganizationId && activeOrganizations.length > 1) {
      return new Response(
        JSON.stringify({
          isError: true,
          code: AUTH_PROCESS_CODES.UNKNOWN_ERROR,
          message: 'organization selection is required',
        }),
        {
          status: HttpStatusCode.BadRequest,
        },
      );
    }

    const organizationPayload = await normalizeOrganizationPayload(db, null, {
      organizationId: requestedOrganizationId,
      institutionId,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userDoc: any = {
      email,
      firstName,
      lastName,
      phoneNumber,
      isStudent,
      is_verified: false,
      created_at: new Date(),
      role: isStudent ? 'student' : 'user',
      password: hashedPassword,
      organization_id: organizationPayload.organization_id,
    };

    userDoc.institution_id = organizationPayload.institution_id;

    // Keep legacy fields for backward compatibility
    if (institutionType) {
      userDoc.institutionType = institutionType;
    }
    if (schoolName) {
      userDoc.schoolName = schoolName;
    }
    if (grade) {
      userDoc.grade = grade;
    }

    await db.collection(dbCollections.users.name).insertOne(userDoc);

    await resend.emails.send({
      from: 'Sparked Support <support@sparkednext.app>',
      to: email,
      subject: 'Welcome to Sparked!',
      react: WelcomeEmail({ name: `${firstName} ${lastName}` }),
    });

    const response = {
      isError: false,
      code: AUTH_PROCESS_CODES.USER_CREATED,
      email,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch (error) {
    const errorCodeIndex = `${JSON.stringify(error)}`.lastIndexOf('code');

    const code = errorCodeIndex === -1 ? 0 : Number(`${error}`.substring(errorCodeIndex).match(/\d+/g));

    const resp = {
      isError: true,
      code,
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
