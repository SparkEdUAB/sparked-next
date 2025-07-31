import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/authOptions';
import createPageLink_ from '../create';
import editPageLink_ from '../edit';
import deletePageLink_ from '../delete';
import fetchPageLinks_, { assignPageActionToPageLink_, unAssignPageActionToPageLink_ } from '..';
import { HttpStatusCode } from 'axios';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const pageLinksFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    createPageLink: createPageLink_,
    editPageLink: editPageLink_,
    assignPageActionToPageLink: assignPageActionToPageLink_,
    unAssignPageActionToPageLink: unAssignPageActionToPageLink_,
  };

  if (pageLinksFunctions[slug] && session) {
    return pageLinksFunctions[slug](request, session);
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

export async function DELETE(
  req: NextRequest,

  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const pageLinksFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    deletePageLink: deletePageLink_,
  };

  if (pageLinksFunctions[slug] && session) {
    return pageLinksFunctions[slug](req, session);
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
  const { slug } = await params;

  const pageLinksFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    fetchPageLinks: fetchPageLinks_,
  };

  if (pageLinksFunctions[slug]) {
    return pageLinksFunctions[slug](req);
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