import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';

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
        status: 200,
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
      status: 200,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}
