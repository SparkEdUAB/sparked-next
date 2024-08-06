import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import fetchCourses_, { deleteCourse_, fetchCourseById_, findCourseByName_ } from '..';
import { authOptions } from '../../auth/constants';
import editCourse_ from '../edit';
import createCourse_ from '../create';
import { HttpStatusCode } from 'axios';

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const CourseFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    createCourse: createCourse_,
    editCourse: editCourse_,
    deleteCourse: deleteCourse_,
  };

  if (CourseFunctions[slug] && session) {
    return CourseFunctions[slug](req, session);
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

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;

  const CourseFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    fetchCourses: fetchCourses_,
    fetchCourseById: fetchCourseById_,
    findCourseByName: findCourseByName_,
  };

  if (CourseFunctions[slug]) {
    return CourseFunctions[slug](req);
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
