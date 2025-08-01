import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import fetchUnits_, {
  deleteUnits_,
  fetchUnitsByGradeId_,
  fetchUnitById_,
  fetchUnitsBySubjectId_,
  fetchUnitsByTopicId_,
  findUnitsByName_,
} from '..';
import { authOptions } from '../../auth/authOptions';
import createUnit_ from '../create';
import editUnit_ from '../edit';
import { HttpStatusCode } from 'axios';
import { NextRequest } from 'next/server';

export async function POST(
  req: NextRequest,

  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const unitFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    createUnit: createUnit_,
    editUnit: editUnit_,
    deleteUnits: deleteUnits_,
  };

  if (unitFunctions[slug] && session) {
    return unitFunctions[slug](req, session);
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

  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const unitFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    fetchUnits: fetchUnits_,
    fetchUnitById: fetchUnitById_,
    findUnitsByName: findUnitsByName_,
    fetchUnitsBySubjectId: fetchUnitsBySubjectId_,
    fetchUnitsByTopicId: fetchUnitsByTopicId_,
    fetchUnitsByGradeId: fetchUnitsByGradeId_,
  };

  if (unitFunctions[slug]) {
    return unitFunctions[slug](req);
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

  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const unitFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    deleteUnits: deleteUnits_,
  };

  if (unitFunctions[slug] && session) {
    return unitFunctions[slug](req, session);
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

  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const unitFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    editUnit: editUnit_,
  };

  if (unitFunctions[slug] && session) {
    return unitFunctions[slug](req, session);
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