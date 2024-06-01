import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import fetchUserRoles_, { fetchUserRoleById_ } from '..';
import { authOptions } from '../../auth/constants';
import createUserRole_ from '../create';
import deleteUserRoles_ from '../delete';
import editUserRole_ from '../edit';

export async function POST(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const gradeApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    createUserRole: createUserRole_,
  };

  if (gradeApiFunctions[slug] && session) {
    return gradeApiFunctions[slug](req, session);
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

export async function PUT(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const gradeApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    editUserRole: editUserRole_,
  };

  if (gradeApiFunctions[slug] && session) {
    return gradeApiFunctions[slug](req, session);
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

export async function DELETE(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const gradeApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    deleteUserRoles: deleteUserRoles_,
  };

  if (gradeApiFunctions[slug] && session) {
    return gradeApiFunctions[slug](req, session);
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
  req: Request,

  { params }: { params: { slug: string } },
) {
  const slug = params.slug;

  const GradeFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    fetchUserRoles: fetchUserRoles_,
    fetchUserRoleById: fetchUserRoleById_,
  };

  if (GradeFunctions[slug]) {
    return GradeFunctions[slug](req);
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
