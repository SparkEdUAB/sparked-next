import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/constants";
import createSchool_ from "../signup";

const schoolApiHandler_ = async function POST(
  req: Request,

  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);

  
  const slug = params.slug;

  const schoolFunctions: { [key: string]: (request: Request) => {} } = {
    createSchool: createSchool_,
  };

  if (schoolFunctions[slug] && session) {
    return schoolFunctions[slug](req);
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

export { schoolApiHandler_ as POST };
