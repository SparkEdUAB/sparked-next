import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/authOptions';
import createGrade_ from '../create';
import deleteGrades_ from '../delete';
import editGrade_ from '../edit';
import fetchGrades, { fetchGradeById_, findGradeByName_ } from '..';
import { HttpStatusCode } from 'axios';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const gradeApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
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
      status: HttpStatusCode.NotFound,
    });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const gradeApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
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
      status: HttpStatusCode.NotFound,
    });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const gradeApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
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
      status: HttpStatusCode.NotFound,
    });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const GradeFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    fetchGrades: fetchGrades,
    fetchGradeById: fetchGradeById_,
    findGradeByName: findGradeByName_,
  };

  if (GradeFunctions[slug]) {
    return GradeFunctions[slug](req);
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