import { HttpStatusCode } from 'axios';
import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import createSummary_ from '..';
import { authOptions } from '../../auth/authOptions';

export async function POST(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const pageActionApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    summarize: createSummary_,
  };

  if (pageActionApiFunctions[slug] && session) {
    return pageActionApiFunctions[slug](req, session);
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
