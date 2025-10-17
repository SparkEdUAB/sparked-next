import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { canMassAssignContent } from './middleware';
import { HttpStatusCode } from 'axios';

export default async function bulkAssignContentToInstitution_(request: Request, session?: Session) {
  const schema = zfd.formData({
    contentIds: z.array(zfd.text()),
    institutionId: zfd.text(),
  });
  
  const formBody = await request.json();
  const { contentIds, institutionId } = schema.parse(formBody);

  try {
    // Check if user has permission to mass assign content
    const canAssign = await canMassAssignContent();
    if (!canAssign) {
      return new Response(JSON.stringify({
        isError: true,
        message: 'Permission denied. Only admins can mass assign content.',
      }), {
        status: HttpStatusCode.Forbidden,
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

    // Verify institution exists
    const institution = await db.collection(dbCollections.institutions.name).findOne({
      _id: new BSON.ObjectId(institutionId),
    });

    if (!institution) {
      return new Response(JSON.stringify({
        isError: true,
        message: 'Institution not found.',
      }), {
        status: HttpStatusCode.NotFound,
      });
    }

    // Convert content IDs to ObjectIds
    const objectIds = contentIds.map(id => new BSON.ObjectId(id));

    // Update all specified content to assign to institution
    const result = await db.collection(dbCollections.media_content.name).updateMany(
      { _id: { $in: objectIds } },
      { 
        $set: { 
          institution_id: new BSON.ObjectId(institutionId),
          updated_at: new Date(),
          //@ts-ignore
          updated_by_id: new BSON.ObjectId(session?.user?.id),
        }
      }
    );

    return new Response(JSON.stringify({
      isError: false,
      message: `Successfully assigned ${result.modifiedCount} content items to institution.`,
      modifiedCount: result.modifiedCount,
    }), {
      status: HttpStatusCode.Ok,
    });

  } catch (error) {
    console.error('Bulk assignment error:', error);
    return new Response(JSON.stringify({
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    }), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}

export async function removeContentFromInstitution_(request: Request, session?: Session) {
  const schema = zfd.formData({
    contentIds: z.array(zfd.text()),
  });
  
  const formBody = await request.json();
  const { contentIds } = schema.parse(formBody);

  try {
    // Check if user has permission to mass assign content
    const canAssign = await canMassAssignContent();
    if (!canAssign) {
      return new Response(JSON.stringify({
        isError: true,
        message: 'Permission denied. Only admins can remove content assignments.',
      }), {
        status: HttpStatusCode.Forbidden,
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

    // Convert content IDs to ObjectIds
    const objectIds = contentIds.map(id => new BSON.ObjectId(id));

    // Remove institution assignment from specified content
    const result = await db.collection(dbCollections.media_content.name).updateMany(
      { _id: { $in: objectIds } },
      { 
        $unset: { institution_id: "" },
        $set: {
          updated_at: new Date(),
          //@ts-ignore
          updated_by_id: new BSON.ObjectId(session?.user?.id),
        }
      }
    );

    return new Response(JSON.stringify({
      isError: false,
      message: `Successfully removed ${result.modifiedCount} content items from institution.`,
      modifiedCount: result.modifiedCount,
    }), {
      status: HttpStatusCode.Ok,
    });

  } catch (error) {
    console.error('Content removal error:', error);
    return new Response(JSON.stringify({
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    }), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}