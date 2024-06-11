import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import fetchUnits_, { deleteUnits_, fetchUnitById_, fetchUnitBySubjectId_, findUnitsByName_ } from '..';
import { authOptions } from '../../auth/constants';
import createUnit_ from '../create';
import editUnit_ from '../edit';

export async function POST(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const unitFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    createUnit: createUnit_,
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
      status: 200,
    });
  }
}

export async function GET(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const slug = params.slug;

  const unitFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    fetchUnits: fetchUnits_,
    fetchUnitById: fetchUnitById_,
    findUnitsByName: findUnitsByName_,
    fetchUnitBySubjectId: fetchUnitBySubjectId_,
  };

  if (unitFunctions[slug]) {
    return unitFunctions[slug](req);
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
