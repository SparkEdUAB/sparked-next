import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import fetchMediaContent_, {
  deleteMediaContentByIds_,
  fetchMediaContentById_,
  fetchRandomMediaContent_,
  fetchRelatedMediaContent_,
  findMediaContentByName_,
} from '..';
import createMediaContent_ from '../create';
import editMediaContent_ from '../edit';
import { NextRequest } from 'next/server';
import { HttpStatusCode } from 'axios';
import { AuthorizationContext, requireAuth, requireRole } from '../../lib/auth';

export async function POST(
  req: NextRequest,

  { params }: { params: Promise<{ slug: string }> },
) {
  const authorization = await requireAuth();
  if (authorization instanceof Response) {
    return authorization;
  }
  const roleError = requireRole(authorization, ['Admin', 'Content Manager']);
  if (roleError) {
    return roleError;
  }

  const { slug } = await params;

  const schoolFunctions: {
    [key: string]: (request: Request, session?: AuthorizationContext['session']) => Promise<Response>;
  } = {
    createMediaContent: createMediaContent_,
    editMediaContent: editMediaContent_,
    deleteMediaContentByIds: deleteMediaContentByIds_,
  };

  if (schoolFunctions[slug]) {
    return schoolFunctions[slug](req, authorization.session);
  } else {
    const response = {
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.NotFound,
    });
  }
}

export async function GET(
  req: NextRequest,

  { params }: { params: Promise<{ slug: string }> },
) {
  const authorization = await requireAuth();
  if (authorization instanceof Response) {
    return authorization;
  }
  const { slug } = await params;

  const schoolFunctions: {
    [key: string]: (request: NextRequest, session?: AuthorizationContext['session']) => Promise<Response>;
  } = {
    fetchRandomMediaContent: fetchRandomMediaContent_,
    fetchMediaContent: fetchMediaContent_,
    fetchMediaContentById: fetchMediaContentById_,
    findMediaContentByName: findMediaContentByName_,
    fetchRelatedMediaContent: fetchRelatedMediaContent_,
  };

  if (schoolFunctions[slug]) {
    return schoolFunctions[slug](req, authorization.session);
  } else {
    const response = {
      isError: 'true',
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.NotFound,
    });
  }
}
