import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import fetchPrograms_, { deletePrograms_, fetchProgramById_, findProgramsByName_ } from '..';
import { authOptions } from '../../auth/authOptions';
import createProgram_ from '../create';
import editProgram_ from '../edit';
import { HttpStatusCode } from 'axios';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const schoolFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    createProgram: createProgram_,
    fetchPrograms: fetchPrograms_,
    fetchProgramById: fetchProgramById_,
    editProgram: editProgram_,
    deletePrograms: deletePrograms_,
    findProgramsByName: findProgramsByName_,
  };

  if (schoolFunctions[slug] && session) {
    return schoolFunctions[slug](req, session);
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