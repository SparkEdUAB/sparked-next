import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import readConfigFile_ from '..';
import { authOptions } from '../../auth/constants';

const configFileApiHandler_ = async function POST(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const configFunctions: {
    [key: string]: (request: Request, session?: Session) => {};
  } = {
    readConfigFile: readConfigFile_,
  };

  if (configFunctions[slug] && session) {
    return configFunctions[slug](req, session);
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

export { configFileApiHandler_ as POST };
