import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import fetchPageActions_ from '..';
import { authOptions } from '../../auth/authOptions';
import createPageAction_ from '../create';
import deletePageActions_ from '../delete';
import editPageAction_ from '../edit';
import { HttpStatusCode } from 'axios';
import { NextRequest } from 'next/server';

export async function POST(
  req: NextRequest,

  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const pageActionApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    createPageAction: createPageAction_,
  };

  if (pageActionApiFunctions[slug] && session) {
    return pageActionApiFunctions[slug](req, session);
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

export async function PUT(
  req: NextRequest,

  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const pageActionApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    editPageAction: editPageAction_,
  };

  if (pageActionApiFunctions[slug] && session) {
    return pageActionApiFunctions[slug](req, session);
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

  const pageActionApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    deletePageActions: deletePageActions_,
  };

  if (pageActionApiFunctions[slug] && session) {
    return pageActionApiFunctions[slug](req, session);
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
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const pageActionApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    fetchPageActions: fetchPageActions_,
  };

  if (pageActionApiFunctions[slug] && session) {
    return pageActionApiFunctions[slug](req, session);
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