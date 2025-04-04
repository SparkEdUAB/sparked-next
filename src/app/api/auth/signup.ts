import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import AUTH_PROCESS_CODES from './processCodes';
import { HttpStatusCode } from 'axios';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import { WelcomeEmail } from 'emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function signup_(request: Request) {
  const schema = zfd.formData({
    email: zfd.text(),
    password: zfd.text(),
    firstName: zfd.text(),
    lastName: zfd.text(),
    phoneNumber: zfd.text(),
    isStudent: z.boolean().default(true),
    institutionType: zfd.text().optional(),
    schoolName: z.string().optional().default(''),
    grade: z.any().optional().default(0),
  });

  const formBody = await request.json();
  const { email, password, firstName, lastName, phoneNumber, isStudent, institutionType, schoolName, grade } =
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

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection(dbCollections.users.name).insertOne({
      email,
      firstName,
      lastName,
      phoneNumber,
      isStudent,
      institutionType,
      schoolName,
      grade,
      is_verified: false,
      created_at: new Date(),
      role: 'student',
      password: hashedPassword,
    });

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
