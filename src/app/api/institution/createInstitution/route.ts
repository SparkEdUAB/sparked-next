import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { zfd } from 'zod-form-data';
import { dbClient } from '../../lib/db';
import { dbCollections } from '../../lib/db/collections';
import { HttpStatusCode } from 'axios';
import { NextRequest } from 'next/server';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  const schema = zfd.formData({
    name: zfd.text(),
    description: zfd.text().optional(),
    type: z.enum(['school', 'college', 'university', 'organization']),
    website: zfd.text().optional(),
    address: zfd.text().optional(),
    contact_email: zfd.text().optional(),
    contact_phone: zfd.text().optional(),
    is_verified: z.boolean().default(false),
  });

  const formBody = await request.json();
  const { name, description, type, website, address, contact_email, contact_phone, is_verified } = 
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

    // Check if institution with same name already exists
    const existingInstitution = await db
      .collection(dbCollections.institutions.name)
      .findOne({ name: { $regex: `^${name}$`, $options: 'i' } });

    if (existingInstitution) {
      const response = {
        isError: true,
        code: 'INSTITUTION_ALREADY_EXISTS',
        message: 'An institution with this name already exists',
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    const institutionDoc = {
      name,
      description: description || '',
      type,
      website: website || '',
      address: address || '',
      contact_email: contact_email || '',
      contact_phone: contact_phone || '',
      is_verified,
      created_at: new Date(),
      created_by_id: null, // TODO: Get from session when auth is available
    };

    const result = await db
      .collection(dbCollections.institutions.name)
      .insertOne(institutionDoc);

    const response = {
      isError: false,
      institutionId: result.insertedId,
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