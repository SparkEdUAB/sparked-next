import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import fetchMediaContent_, {
  deleteMediaContentByIds_,
  fetchMediaContentById_,
  fetchRandomMediaContent_,
  fetchRelatedMediaContent_,
  findMediaContentByName_,
} from '..';
import { authOptions } from '../../auth/authOptions';
import createMediaContent_ from '../create';
import editMediaContent_ from '../edit';
import { NextRequest } from 'next/server';

export async function POST(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const schoolFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    createMediaContent: createMediaContent_,
    editMediaContent: editMediaContent_,
    deleteMediaContentByIds: deleteMediaContentByIds_,
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
}

export async function GET(
  req: NextRequest,

  { params }: { params: { slug: string } },
) {
  const slug = params.slug;

  const schoolFunctions: {
    [key: string]: (request: NextRequest, session?: Session | undefined) => Promise<Response>;
  } = {
    fetchRandomMediaContent: fetchRandomMediaContent_,
    fetchMediaContent: fetchMediaContent_,
    fetchMediaContentById: fetchMediaContentById_,
    findMediaContentByName: findMediaContentByName_,
    fetchRelatedMediaContent: fetchRelatedMediaContent_,
  };

  if (schoolFunctions[slug]) {
    return schoolFunctions[slug](req);
  } else {
    const response = {
      isError: 'true',
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  }
}
