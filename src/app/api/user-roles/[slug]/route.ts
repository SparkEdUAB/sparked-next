import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import fetchUserRoles_, { assignUserRole_, fetchUserRoleById_ } from '..';
import { authOptions } from '../../auth/authOptions';
import createUserRole_ from '../create';
import deleteUserRoles_ from '../delete';
import editUserRole_ from '../edit';
import { HttpStatusCode } from 'axios';

export async function POST(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const roleApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    createUserRole: createUserRole_,
  };

  if (roleApiFunctions[slug] && session) {
    return roleApiFunctions[slug](req, session);
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
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const roleApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    editUserRole: editUserRole_,
    assignUserRole: assignUserRole_,
  };

  if (roleApiFunctions[slug] && session) {
    return roleApiFunctions[slug](req, session);
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
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const roleApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    deleteUserRoles: deleteUserRoles_,
  };

  if (roleApiFunctions[slug] && session) {
    return roleApiFunctions[slug](req, session);
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
  req: Request,

  { params }: { params: { slug: string } },
) {
  const slug = params.slug;

  const roleFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    fetchUserRoles: fetchUserRoles_,
    fetchUserRoleById: fetchUserRoleById_,
  };

  if (roleFunctions[slug]) {
    return roleFunctions[slug](req);
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
