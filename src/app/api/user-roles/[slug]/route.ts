import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/authOptions';
import createUserRole_ from '../create';
import editUserRole_ from '../edit';
import deleteUserRoles_ from '../delete';
import fetchUserRoles_, { fetchUserRoleById_ } from '..';
import { HttpStatusCode } from 'axios';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const userRoleFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    createUserRole: createUserRole_,
  };

  if (userRoleFunctions[slug] && session) {
    return userRoleFunctions[slug](req, session);
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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const userRoleFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    editUserRole: editUserRole_,
  };

  if (userRoleFunctions[slug] && session) {
    return userRoleFunctions[slug](req, session);
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const userRoleFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    deleteUserRoles: deleteUserRoles_,
  };

  if (userRoleFunctions[slug] && session) {
    return userRoleFunctions[slug](req, session);
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

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const userRoleFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    fetchUserRoles: fetchUserRoles_,
    fetchUserRoleById: fetchUserRoleById_,
    
  };

  if (userRoleFunctions[slug] && session) {
    return userRoleFunctions[slug](req, session);
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