import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { Session } from 'next-auth';
import { BSON } from 'mongodb';
import PAGE_LINK_PROCESS_CODES from './processCodes';
import { HttpStatusCode } from 'axios';

export default async function fetchPageLinks_(request: any) {
  const schema = zfd.formData({
    limit: zfd.numeric().optional().default(1000),
    skip: zfd.numeric().optional().default(0),
  });
  const params = request.nextUrl.searchParams;

  const { limit, skip } = schema.parse(params);

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

    const pageLinks = await db
      .collection(dbCollections.page_links.name)
      .find(
        {},
        {
          skip,
          limit,
        },
      )
      .toArray();

    const response = {
      isError: false,
      pageLinks,
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

export async function assignPageActionToPageLink_(request: Request, session?: Session) {
  const schema = zfd.formData({
    pageLinkId: zfd.text(),
    pageActionId: zfd.text(),
  });

  const formBody = await request.json();

  const { pageActionId, pageLinkId } = schema.parse(formBody);

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

    const pageLinkData = await db.collection(dbCollections.page_links.name).findOne(
      {
        page_action_ids: { $in: [new BSON.ObjectId(pageActionId)] },
      },
      {
        projection: {
          _id: 1,
        },
      },
    );

    if (pageLinkData) {
      const response = {
        isError: true,
        code: PAGE_LINK_PROCESS_CODES.PAGE_ACTION_ALREADY_LINKED,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.BadRequest,
      });
    }
    const query = {
      _id: new BSON.ObjectId(pageLinkId),
    };

    const updateQuery = {
      $set: {
        //@ts-ignore
        updated_by: new BSON.ObjectId(session?.user?.id),
        updated_at: new Date(),
      },
      $push: { page_action_ids: new BSON.ObjectId(pageActionId) },
    };
    //@ts-ignore
    await db.collection(dbCollections.page_links.name).updateOne(query, updateQuery);

    const response = {
      isError: false,
      code: PAGE_LINK_PROCESS_CODES.PAGE_ACTION_LINKED,
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

export async function unAssignPageActionToPageLink_(request: Request, session?: Session) {
  const schema = zfd.formData({
    pageLinkId: zfd.text(),
    pageActionId: zfd.text(),
  });

  const formBody = await request.json();

  const { pageActionId, pageLinkId } = schema.parse(formBody);

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

    const pageLinkData = await db.collection(dbCollections.page_links.name).findOne(
      {
        page_action_ids: { $in: [new BSON.ObjectId(pageActionId)] },
      },
      {
        projection: {
          _id: 1,
        },
      },
    );

    if (!pageLinkData) {
      const response = {
        isError: true,
        code: PAGE_LINK_PROCESS_CODES.PAGE_ACTION_NOT_FOUND,
      };

      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.NotFound,
      });
    }
    const query = {
      _id: new BSON.ObjectId(pageLinkId),
    };

    const updateQuery = {
      $set: {
        //@ts-ignore
        updated_by: new BSON.ObjectId(session?.user?.id),
        updated_at: new Date(),
      },
      $pull: { page_action_ids: new BSON.ObjectId(pageActionId) },
    };
    //@ts-ignore
    await db.collection(dbCollections.page_links.name).updateOne(query, updateQuery);

    const response = {
      isError: false,
      code: PAGE_LINK_PROCESS_CODES.PAGE_ACTION_UN_LINKED,
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
