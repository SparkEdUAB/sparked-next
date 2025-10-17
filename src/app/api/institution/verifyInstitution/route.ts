import { NextRequest } from 'next/server';
import { z } from 'zod';
import { dbClient } from '../../lib/db';
import { dbCollections } from '../../lib/db/collections';
import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { HttpStatusCode } from 'axios';
import { BSON } from 'mongodb';

export async function POST(request: NextRequest) {
  const schema = z.object({
    institutionId: z.string().min(1, "Institution ID is required"),
    action: z.enum(['approve', 'reject']),
    rejectionReason: z.string().optional(),
  });

  try {
    const formBody = await request.json();
    const { institutionId, action, rejectionReason } = schema.parse(formBody);

    // Validate ObjectId format
    if (!BSON.ObjectId.isValid(institutionId)) {
      return new Response(JSON.stringify({
        isError: true,
        code: 'INVALID_INSTITUTION_ID',
        message: 'Invalid institution ID format',
      }), {
        status: HttpStatusCode.BadRequest,
      });
    }

    const db = await dbClient();

    if (!db) {
      return new Response(JSON.stringify({
        isError: true,
        code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
      }), {
        status: HttpStatusCode.InternalServerError,
      });
    }

    // Check if institution exists
    const existingInstitution = await db
      .collection(dbCollections.institutions.name)
      .findOne({ _id: new BSON.ObjectId(institutionId) });

    if (!existingInstitution) {
      return new Response(JSON.stringify({
        isError: true,
        code: 'INSTITUTION_NOT_FOUND',
        message: 'Institution not found',
      }), {
        status: HttpStatusCode.NotFound,
      });
    }

    if (action === 'approve') {
      // Approve the institution
      await db
        .collection(dbCollections.institutions.name)
        .updateOne(
          { _id: new BSON.ObjectId(institutionId) },
          { 
            $set: { 
              is_verified: true,
              verified_at: new Date(),
              updated_at: new Date()
            },
            $unset: { rejection_reason: "" }
          }
        );

      return new Response(JSON.stringify({
        isError: false,
        message: 'Institution approved successfully',
      }), {
        status: HttpStatusCode.Ok,
      });

    } else if (action === 'reject') {
      // Reject the institution (or delete it, depending on business logic)
      await db
        .collection(dbCollections.institutions.name)
        .updateOne(
          { _id: new BSON.ObjectId(institutionId) },
          { 
            $set: { 
              is_verified: false,
              rejection_reason: rejectionReason || 'Institution rejected by admin',
              rejected_at: new Date(),
              updated_at: new Date()
            }
          }
        );

      return new Response(JSON.stringify({
        isError: false,
        message: 'Institution rejected successfully',
      }), {
        status: HttpStatusCode.Ok,
      });
    }

  } catch (error) {
    console.error('Institution verification error:', error);
    return new Response(JSON.stringify({
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    }), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}