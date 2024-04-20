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

const mediaContentPostApiHandler_ = async function POST(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const schoolFunctions: {
    [key: string]: (request: Request, session?: Session) => {};
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
};

const mediaContentGetApiHandler_ = async function GET(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const schoolFunctions: {
    [key: string]: (request: Request, session?: Session) => {};
  } = {
    fetchRandomMediaContent: fetchRandomMediaContent_,
    fetchMediaContent: fetchMediaContent_,
    fetchMediaContentById: fetchMediaContentById_,
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

export { mediaContentGetApiHandler_ as GET, mediaContentPostApiHandler_ as POST };
