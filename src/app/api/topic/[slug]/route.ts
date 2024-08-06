import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import fetchTopics_, {
  deleteTopics_,
  fetchTopicsByGradeId_,
  fetchTopicById_,
  findTopicsByName_,
  fetchTopicsBySubjectId_,
  fetchTopicsByUnitId_,
} from '..';
import { authOptions } from '../../auth/constants';
import createTopic_ from '../create';
import editTopic_ from '../edit';
import { HttpStatusCode } from 'axios';

export async function POST(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const topicFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    createTopic: createTopic_,
    editTopic: editTopic_,
    deleteTopics: deleteTopics_,
  };

  if (topicFunctions[slug] && session) {
    return topicFunctions[slug](req, session);
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

export async function GET(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const slug = params.slug;

  const topicFunctions: {
    [key: string]: (request: Request, session?: Session) => Promise<Response>;
  } = {
    fetchTopics: fetchTopics_,
    fetchTopicById: fetchTopicById_,
    findTopicsByName: findTopicsByName_,
    fetchTopicsByUnitId: fetchTopicsByUnitId_,
    fetchTopicsByGradeId: fetchTopicsByGradeId_,
    fetchTopicsBySubjectId: fetchTopicsBySubjectId_,
  };

  if (topicFunctions[slug]) {
    return topicFunctions[slug](req);
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
