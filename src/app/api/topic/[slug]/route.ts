import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import fetchTopics_, {
  deleteTopics_,
  fetchTopicById_,
  fetchTopicsByGradeId_,
  fetchTopicsBySubjectId_,
  fetchTopicsByUnitId_,
  findTopicsByName_,
} from '..';
import { authOptions } from '../../auth/authOptions';

import createTopic_ from '../create';
import editTopic_ from '../edit';
import { HttpStatusCode } from 'axios';
import { NextRequest } from 'next/server';

export async function POST(
  req: NextRequest,

  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await getServerSession(authOptions);

  const { slug } = await params;

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
  req: NextRequest,

  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

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