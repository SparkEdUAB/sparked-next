import { HttpStatusCode } from 'axios';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { authOptions } from '../../auth/authOptions';
import fetchSettings_, { fetchInstitutions_ } from '..';
import updateSettings_ from '../update';
import { addInstitution_, updateInstitution_, removeInstitution_ } from '../institutions';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug;

  const settingsFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    fetchSettings: fetchSettings_,
    fetchInstitutions: fetchInstitutions_,
  };

  if (settingsFunctions[slug]) {
    const response = await settingsFunctions[slug](req);
    
    // Add cache headers for all GET responses
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600'); // Cache for 1 hour
    
    return new Response(response.body, {
      status: response.status,
      headers,
    });
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

export async function POST(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);
  const slug = params.slug;

  const settingsFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    updateSettings: updateSettings_,
    addInstitution: addInstitution_,
    updateInstitution: updateInstitution_,
    removeInstitution: removeInstitution_,
  };

  if (settingsFunctions[slug] && session) {
    return settingsFunctions[slug](req, session);
  } else {
    const response = {
      isError: true,
      code: session ? SPARKED_PROCESS_CODES.METHOD_NOT_FOUND : SPARKED_PROCESS_CODES.UNAUTHORIZED,
    };

    return new Response(JSON.stringify(response), {
      status: session ? HttpStatusCode.NotFound : HttpStatusCode.Unauthorized,
    });
  }
}
