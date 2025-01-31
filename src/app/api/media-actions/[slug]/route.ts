import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getMediaReactionCounts_ } from '..';
import { HttpStatusCode } from 'axios';
import createMediaView_, { createMediaReaction_ } from '../create';

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;

  const pageLinksFunctions: {
    [key: string]: (request: any) => Promise<Response>;
  } = {
    createMediaView: createMediaView_,
    createMediaReaction: createMediaReaction_,
  };

  if (pageLinksFunctions[slug]) {
    return pageLinksFunctions[slug](request);
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
  req: Request,

  { params }: { params: { slug: string } },
) {
  const slug = params.slug;

  const pageLinksFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    getMediaReactionCounts: getMediaReactionCounts_,
  };

  if (pageLinksFunctions[slug]) {
    return pageLinksFunctions[slug](req);
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
