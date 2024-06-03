import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import fetchSubjects_ from '..';
import { authOptions } from '../../auth/constants';
import createPageAction_ from '../create';
import deleteSubjects_ from '../delete';
import editSubject_ from '../edit';

export async function POST(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const pageActionApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    createPageAction: createPageAction_,
  };

  if (pageActionApiFunctions[slug] && !session) {
    return pageActionApiFunctions[slug](req, session);
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

  const pageActionApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    editSubject: editSubject_,
  };

  if (pageActionApiFunctions[slug] && session) {
    return pageActionApiFunctions[slug](req, session);
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

  const pageActionApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    deleteSubjects: deleteSubjects_,
  };

  if (pageActionApiFunctions[slug] && session) {
    return pageActionApiFunctions[slug](req, session);
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
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const pageActionApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    fetchSubjects: fetchSubjects_,
  };

  if (pageActionApiFunctions[slug] && session) {
    return pageActionApiFunctions[slug](req, session);
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
