import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/constants';
import createGrade_ from '../create';
import deleteGrades_ from '../delete';
import editGrade_ from '../edit';

export async function POST(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const gradeApiFunctions: {
    [key: string]: (request: Request, session?: Session) => {};
  } = {
    createGrade: createGrade_,
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
    [key: string]: (request: Request, session?: Session) => {};
  } = {
    editGrade: editGrade_,
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
    [key: string]: (request: Request, session?: Session) => {};
  } = {
    deleteGrades: deleteGrades_,
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

  const gradeApiFunctions: {
    [key: string]: (request: Request, session?: Session) => {};
  } = {};

  if (gradeApiFunctions[slug]) {
    return gradeApiFunctions[slug](req);
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
