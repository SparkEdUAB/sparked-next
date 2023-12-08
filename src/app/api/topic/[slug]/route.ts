import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import fetchTopics_, {
  deleteUnits_,
  fetchUnitById_,
  findUnitsByName_,
} from "..";
import { authOptions } from "../../auth/constants";
import createTopic_ from "../create";
import editUnit_ from "../edit";

const schoolApiHandler_ = async function POST(
  req: Request,

  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const schoolFunctions: {
    [key: string]: (request: Request, session?: Session) => {};
  } = {
    createTopic: createTopic_,
    fetchTopics: fetchTopics_,
    fetchUnitById: fetchUnitById_,
    editUnit: editUnit_,
    deleteUnits: deleteUnits_,
    findUnitsByName: findUnitsByName_,
  };

  if (schoolFunctions[slug] && session) {
    return schoolFunctions[slug](req, session);
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
