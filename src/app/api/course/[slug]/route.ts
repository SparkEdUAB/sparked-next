import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import fetchCourses_, {
  deleteCourse_,
  fetchCourseById_,
  findCourseByName_,
} from "..";
import { authOptions } from "../../auth/constants";
import createCourse_ from "../create";
import editCourse_ from "../edit";

const schoolApiHandler_ = async function POST(
  req: Request,

  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const schoolFunctions: {
    [key: string]: (request: Request, session?: Session) => {};
  } = {
    createCourse: createCourse_,
    fetchCourses: fetchCourses_,
    fetchCourseById: fetchCourseById_,
    editCourse: editCourse_,
    deleteCourse: deleteCourse_,
    findCourseByName: findCourseByName_,
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
