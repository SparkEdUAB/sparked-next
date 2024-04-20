import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import fetchTopics_, {
  deleteTopics_,
  fetchTopicById_,
  findTopicsByName_,
} from "..";
import { authOptions } from "../../auth/constants";
import createTopic_ from "../create";
import editTopic_ from "../edit";

const topicPostApiHandler_ = async function POST(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const topicFunctions: {
    [key: string]: (request: Request, session?: Session) => {};
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
      status: 200,
    });
  }
};

const topicGetApiHandler_ = async function GET(
  req: Request,

  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);

  const slug = params.slug;

  const topicFunctions: {
    [key: string]: (request: Request, session?: Session) => {};
  } = {
    fetchTopics: fetchTopics_,
    fetchTopicById: fetchTopicById_,
    findTopicsByName: findTopicsByName_,
  };

  if (topicFunctions[slug] && session) {
    return topicFunctions[slug](req, session);
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

export { topicPostApiHandler_ as POST, topicGetApiHandler_ as GET };
