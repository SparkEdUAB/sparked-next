import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/constants';
import createSubject_ from '../create';
import editSubject_ from '../edit';
import deleteSubjects_ from '../delete';
import fetchSubjects_, { fetchSubjectsByGradeId_, findSubjectByName_ } from '..';

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const subjectApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    createSubject: createSubject_,
  };

  if (subjectApiFunctions[slug] && session) {
    return subjectApiFunctions[slug](req, session);
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

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const subjectApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    editSubject: editSubject_,
  };

  if (subjectApiFunctions[slug] && session) {
    return subjectApiFunctions[slug](req, session);
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

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const subjectApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    deleteSubjects: deleteSubjects_,
  };

  if (subjectApiFunctions[slug] && session) {
    return subjectApiFunctions[slug](req, session);
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

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;

  const subjectApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    fetchSubjects: fetchSubjects_,
    findSubjectByName: findSubjectByName_,
    fetchSubjectsByGradeId: fetchSubjectsByGradeId_,
  };

  if (subjectApiFunctions[slug]) {
    // @ts-expect-error
    return subjectApiFunctions[slug](req, {});
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
