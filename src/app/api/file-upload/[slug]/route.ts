import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/authOptions';
import { Session } from 'next-auth';
import uploadFile_ from '..';
import { HttpStatusCode } from 'axios';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

  const schoolFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    uploadFile: uploadFile_,
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

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };