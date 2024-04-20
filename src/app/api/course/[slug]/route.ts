import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import fetchCourses_, {
  deleteCourse_,
  fetchCourseById_,
  findCourseByName_,
} from "..";
import { authOptions } from "../../auth/constants";
import editCourse_ from "../edit";
import createCourse_ from "../create";

const coursePostApiHandler_ = async function POST(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const CourseFunctions: {
    [key: string]: (request: Request, session?: Session) => {};
  } = {
    createCourse: createCourse_,
    fetchCourses: fetchCourses_,
    fetchCourseById: fetchCourseById_,
    editCourse: editCourse_,
    deleteCourse: deleteCourse_,
    findCourseByName: findCourseByName_,
  };

  if (CourseFunctions[slug] && session) {
    return CourseFunctions[slug](req, session);
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

const courseGetApiHandler_ = async function POST(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const CourseFunctions: {
    [key: string]: (request: Request, session?: Session) => {};
  } = {
    fetchCourses: fetchCourses_,
    fetchCourseById: fetchCourseById_,
    findCourseByName: findCourseByName_,
  };

  if (CourseFunctions[slug] && session) {
    return CourseFunctions[slug](req, session);
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

export { coursePostApiHandler_ as POST, courseGetApiHandler_ as GET };
