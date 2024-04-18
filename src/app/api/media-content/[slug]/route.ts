import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import fetchMediaContent_, {
  deleteMediaContentByIds_,
  fetchMediaContentById_,
  fetchRandomMediaContent_,
  findMediaContentByName_,
} from '..';
import { authOptions } from '../../auth/constants';
import createMediaContent_ from '../create';
import editMediaContent_ from '../edit';
import { dbClient } from '@app/api/lib/db';
import { dbCollections } from '@app/api/lib/db/collections';
import { type NextRequest } from 'next/server';

const schoolPostApiHandler_ = async function POST(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const schoolFunctions: {
    [key: string]: (request: Request, session?: Session) => {};
  } = {
    createMediaContent: createMediaContent_,
    // fetchMediaContent: fetchMediaContent_,
    fetchMediaContentById: fetchMediaContentById_,
    editMediaContent: editMediaContent_,
    deleteMediaContentByIds: deleteMediaContentByIds_,
    findMediaContentByName: findMediaContentByName_,
  };

  if (schoolFunctions[slug] && session) {
    return schoolFunctions[slug](req, session);
  } else {
    const response = {
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  }
};

const schoolGetApiHandler_ = async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const limit = searchParams.get('limit');
  const skip = searchParams.get('skip');

  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
      };
      return Response.json(response);
    }

    const mediaContent = await db.collection(dbCollections.media_content.name).find({}).toArray();

    const response = {
      isError: false,
      mediaContent,
    };

    return Response.json(response);
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };
    return Response.json(resp);
  }
};

export { schoolGetApiHandler_ as GET, schoolPostApiHandler_ as POST };
