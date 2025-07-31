import { NextRequest } from 'next/server';


import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import login_ from '../../auth/login';
import signup_ from '../../auth/signup';
import logout_ from '@app/api/auth';
import { HttpStatusCode } from 'axios';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const { slug } = await params;

  const authFunctions: { [key: string]: (request: Request) => Promise<Response> } = {
    signup: signup_,
    login: login_,
    logout: logout_,
  };

  if (authFunctions[slug]) {
    return authFunctions[slug](request);
  }

  return new Response(
    JSON.stringify({
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    }),
    {
      status: HttpStatusCode.NotFound,
    },
  );
}
