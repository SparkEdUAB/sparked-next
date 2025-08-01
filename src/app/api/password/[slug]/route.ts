import { HttpStatusCode } from 'axios';
import { Session } from 'next-auth';
import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import forgotPassword_ from '..';
import resetPassword_ from '../reset';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const passwordApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    forgotPassword: forgotPassword_,
    resetPassword: resetPassword_,
  };

  if (passwordApiFunctions[slug]) {
    return passwordApiFunctions[slug](req);
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