import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import fetchCounts_ from '..';
import { HttpStatusCode } from 'axios';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,

  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const subjectApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    fetchCounts: fetchCounts_,
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
      status: HttpStatusCode.NotFound,
    });
  }
}