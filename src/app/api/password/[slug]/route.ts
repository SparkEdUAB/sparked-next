import { HttpStatusCode } from 'axios';
import { Session } from 'next-auth';
import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import forgotPassword_ from '..';

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;

  const passwordApiFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    forgotPassword: forgotPassword_,
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
