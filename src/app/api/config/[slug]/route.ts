import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import readConfigFile_ from '..';

export async function GET(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const slug = params.slug;

  const configFunctions: {
    [key: string]: (request: Request, session?: Session) => {};
  } = {
    readConfigFile: readConfigFile_,
  };

  if (configFunctions[slug]) {
    return configFunctions[slug](req);
  } else {
    const response = {
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  }
};

