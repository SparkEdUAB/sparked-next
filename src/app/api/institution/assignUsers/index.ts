import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { z } from 'zod';
import { dbClient } from '../../lib/db';
import { dbCollections } from '../../lib/db/collections';
import { BSON } from 'mongodb';
import { HttpStatusCode } from 'axios';

export default async function assignUsersToInstitution_(request: Request) {
  const schema = z.object({
    userIds: z.array(z.string()),
    institutionId: z.string(),
  });

  try {
    const formBody = await request.json();
    const { userIds, institutionId } = schema.parse(formBody);

    // Validate institution ID
    if (!BSON.ObjectId.isValid(institutionId)) {
      const response = {
        isError: true,
        code: 'INVALID_INSTITUTION_ID',
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }

    // Validate all user IDs
    for (const userId of userIds) {
      if (!BSON.ObjectId.isValid(userId)) {
        const response = {
          isError: true,
          code: 'INVALID_USER_ID',
        };
        return new Response(JSON.stringify(response), {
          status: HttpStatusCode.BadRequest,
        });
      }
    }

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
    const institution = await db
      .collection(dbCollections.institutions.name)
      .findOne({ _id: new BSON.ObjectId(institutionId) });

    if (!institution) {
      const response = {
        isError: true,
        code: 'INSTITUTION_NOT_FOUND',
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }

    // Update all users with the institution_id
    const result = await db.collection(dbCollections.users.name).updateMany(
      {
        _id: { $in: userIds.map((id) => new BSON.ObjectId(id)) },
      },
      {
        $set: {
          institution_id: new BSON.ObjectId(institutionId),
          updated_at: new Date(),
        },
      }
    );

    const response = {
      isError: false,
      message: 'Users assigned to institution successfully',
      modifiedCount: result.modifiedCount,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch (error) {
    console.error('Error assigning users to institution:', error);
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
