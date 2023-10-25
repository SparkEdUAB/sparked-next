import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import fetchPrograms_, {
  deleteSchools_,
  fetchSchool_,
  findSchoolsByName_,
} from "..";
import { authOptions } from "../../auth/constants";
import createProgram_ from "../create";
import editSchool_ from "../edit";

const schoolApiHandler_ = async function POST(
  req: Request,

  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const schoolFunctions: {
    [key: string]: (request: Request, session?: Session) => {};
  } = {
    createProgram: createProgram_,
    fetchPrograms: fetchPrograms_,
    fetchSchool: fetchSchool_,
    editSchool: editSchool_,
    deleteSchools: deleteSchools_,
    findSchoolsByName: findSchoolsByName_,
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
