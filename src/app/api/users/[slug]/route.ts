import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import createUser_ from '../create';
import editUser_ from '../edit';
import deleteUsers_ from '../delete';
import fetchUsers_, { findUserByEmail_, findUserByName_ } from '..';
import { HttpStatusCode } from 'axios';
import { NextRequest } from 'next/server';
import { AuthorizationContext, requireAuth, requireRole } from '../../lib/auth';

async function requireUsersAdmin(): Promise<AuthorizationContext | Response> {
  const authorization = await requireAuth();
  if (authorization instanceof Response) return authorization;

  return requireRole(authorization, ['Admin']) || authorization;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const authorization = await requireUsersAdmin();
  if (authorization instanceof Response) return authorization;
  const { slug } = await params;

  const userApiFunctions: {
    [key: string]: (request: Request, session?: AuthorizationContext['session']) => Promise<Response>;
  } = {
    createUser: createUser_,
    editUser: editUser_,
    deleteUsers: deleteUsers_,
  };

  if (userApiFunctions[slug]) {
    return userApiFunctions[slug](req, authorization.session);
  } else {
    const response = {
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };
    return new Response(JSON.stringify(response), { status: HttpStatusCode.NotFound });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const authorization = await requireUsersAdmin();
  if (authorization instanceof Response) return authorization;
  const { slug } = await params;

  const userApiFunctions: {
    [key: string]: (request: Request, session?: AuthorizationContext['session']) => Promise<Response>;
  } = {
    editUser: editUser_,
  };

  if (userApiFunctions[slug]) {
    return userApiFunctions[slug](req, authorization.session);
  } else {
    const response = {
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };
    return new Response(JSON.stringify(response), { status: HttpStatusCode.NotFound });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const authorization = await requireUsersAdmin();
  if (authorization instanceof Response) return authorization;
  const { slug } = await params;

  const userApiFunctions: {
    [key: string]: (request: Request, session?: AuthorizationContext['session']) => Promise<Response>;
  } = {
    deleteUsers: deleteUsers_,
  };

  if (userApiFunctions[slug]) {
    return userApiFunctions[slug](req, authorization.session);
  } else {
    const response = {
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };
    return new Response(JSON.stringify(response), { status: HttpStatusCode.NotFound });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const authorization = await requireUsersAdmin();
  if (authorization instanceof Response) return authorization;
  const { slug } = await params;

  const userApiFunctions: {
    [key: string]: (request: Request, session?: AuthorizationContext['session']) => Promise<Response>;
  } = {
    fetchUsers: fetchUsers_,
    findUserByName: findUserByName_,
    findUserByEmail: findUserByEmail_,
  };

  if (userApiFunctions[slug]) {
    return userApiFunctions[slug](req, authorization.session);
  } else {
    const response = {
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };
    return new Response(JSON.stringify(response), { status: HttpStatusCode.NotFound });
  }
}
