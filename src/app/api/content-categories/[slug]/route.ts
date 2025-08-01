import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/authOptions';
import createContentCategory_ from '../create';
import { HttpStatusCode } from 'axios';
import editContentCategory_ from '../edit';
import { deleteContentCategoriesById_ } from '../delete';
import { NextRequest } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const contentCategoryFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    createContentCategory: createContentCategory_,
  };

  if (contentCategoryFunctions[slug] && session) {
    return contentCategoryFunctions[slug](req, session);
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
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const contentCategoryFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    editContentCategory: editContentCategory_,
  };

  if (contentCategoryFunctions[slug] && session) {
    return contentCategoryFunctions[slug](req, session);
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
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const contentCategoryFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    deleteContentCategoriesById: deleteContentCategoriesById_,
  };

  if (contentCategoryFunctions[slug] && session) {
    return contentCategoryFunctions[slug](req, session);
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
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const contentCategoryFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {};

  if (contentCategoryFunctions[slug]) {
    return contentCategoryFunctions[slug](req);
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