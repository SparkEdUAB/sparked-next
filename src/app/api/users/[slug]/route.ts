import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/authOptions';
import createUser_ from '../create';
import editUser_ from '../edit';
import deleteUsers_ from '../delete';
import fetchUsers_, { findUserByEmail_, findUserByName_ } from '..';
import { HttpStatusCode } from 'axios';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  const { slug } = await params;

  const userApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    createUser: createUser_,
    editUser: editUser_,
    deleteUsers: deleteUsers_,
  };

  if (userApiFunctions[slug] && session) {
    return userApiFunctions[slug](req, session);
  } else {
    const response = {
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };
    return new Response(JSON.stringify(response), { status: HttpStatusCode.NotFound });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  const { slug } = await params;

  const userApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    editUser: editUser_,
  };

  if (userApiFunctions[slug] && session) {
    return userApiFunctions[slug](req, session);
  } else {
    const response = {
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };
    return new Response(JSON.stringify(response), { status: HttpStatusCode.NotFound });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  const { slug } = await params;

  const userApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    deleteUsers: deleteUsers_,
  };

  if (userApiFunctions[slug] && session) {
    return userApiFunctions[slug](req, session);
  } else {
    const response = {
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };
    return new Response(JSON.stringify(response), { status: HttpStatusCode.NotFound });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const userApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    fetchUsers: fetchUsers_,
    findUserByName: findUserByName_,
    findUserByEmail: findUserByEmail_,
  };

  if (userApiFunctions[slug]) {
    // @ts-expect-error
    return userApiFunctions[slug](req, {});
  } else {
    const response = {
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };
    return new Response(JSON.stringify(response), { status: HttpStatusCode.NotFound });
  }
}