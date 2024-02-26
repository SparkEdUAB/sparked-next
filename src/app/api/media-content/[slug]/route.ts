import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import fetchMediaContent_, {
  deleteMediaContentByIds_,
  fetchMediaContentById_,
  findMediaContentByName_,
} from "..";
import { authOptions } from "../../auth/constants";
import createMediaContent_ from "../create";
import editMediaContent_ from "../edit";

const schoolApiHandler_ = async function POST(
  req: Request,

  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const schoolFunctions: {
    [key: string]: (request: Request, session?: Session) => {};
  } = {
    createMediaContent: createMediaContent_,
    fetchMediaContent: fetchMediaContent_,
    fetchMediaContentById: fetchMediaContentById_,
    editMediaContent: editMediaContent_,
    deleteMediaContentByIds: deleteMediaContentByIds_,
    findMediaContentByName: findMediaContentByName_,
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
