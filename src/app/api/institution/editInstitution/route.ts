import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { zfd } from 'zod-form-data';
import { dbClient } from '../../lib/db';
import { dbCollections } from '../../lib/db/collections';
import { HttpStatusCode } from 'axios';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { BSON } from 'mongodb';

export async function PUT(request: NextRequest) {
  const schema = zfd.formData({
    institutionId: zfd.text(),
    name: zfd.text(),
    description: zfd.text().optional(),
    type: z.enum(['school', 'college', 'university', 'organization']),
    website: zfd.text().optional(),
    address: zfd.text().optional(),
    contact_email: zfd.text().optional(),
    contact_phone: zfd.text().optional(),
    is_verified: z.boolean().optional(),
  });

  const formBody = await request.json();
  const { institutionId, name, description, type, website, address, contact_email, contact_phone, is_verified } = 
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

    // Check if institution exists
    const existingInstitution = await db
      .collection(dbCollections.institutions.name)
      .findOne({ _id: new BSON.ObjectId(institutionId) });

    if (!existingInstitution) {
      const response = {
        isError: true,
        code: 'INSTITUTION_NOT_FOUND',
        message: 'Institution not found',
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    // Check for name conflicts (excluding current institution)
    const nameConflict = await db
      .collection(dbCollections.institutions.name)
      .findOne({ 
        name: { $regex: `^${name}$`, $options: 'i' },
        _id: { $ne: new BSON.ObjectId(institutionId) }
      });

    if (nameConflict) {
      const response = {
        isError: true,
        code: 'INSTITUTION_NAME_EXISTS',
        message: 'An institution with this name already exists',
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    const updateDoc: any = {
      name,
      type,
      updated_at: new Date(),
    };

    if (description !== undefined) updateDoc.description = description;
    if (website !== undefined) updateDoc.website = website;
    if (address !== undefined) updateDoc.address = address;
    if (contact_email !== undefined) updateDoc.contact_email = contact_email;
    if (contact_phone !== undefined) updateDoc.contact_phone = contact_phone;
    if (is_verified !== undefined) updateDoc.is_verified = is_verified;

    await db
      .collection(dbCollections.institutions.name)
      .updateOne(
        { _id: new BSON.ObjectId(institutionId) },
        { $set: updateDoc }
      );

    const response = {
      isError: false,
      message: 'Institution updated successfully',
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