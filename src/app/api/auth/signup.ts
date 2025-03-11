import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { realmApp } from '../lib/db/realm';
import AUTH_PROCESS_CODES from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function signup_(request: Request) {
  const schema = zfd.formData({
    email: zfd.text(),
    password: zfd.text(),
    firstName: zfd.text(),
    lastName: zfd.text(),
    phoneNumber: zfd.text(),
    isStudent: z.boolean(),
    institutionType: zfd.text().optional(),
    schoolName: zfd.text().optional(),
    grade: zfd.numeric().optional(),
  });
  
  const formBody = await request.json();
  const { email, password, firstName, lastName, phoneNumber, isStudent, institutionType, schoolName, grade } = schema.parse(formBody);

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

    await realmApp.emailPasswordAuth.registerUser({
      email,
      password,
    });

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
      role: 'user', // default role
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
