import { HttpStatusCode } from 'axios';

import { GoogleGenerativeAI } from '@google/generative-ai';
import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { cacheSummary, getCachedSummary } from 'utils/helpers/summaryCache';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || '');

export default async function createSummary_(request: Request) {
  try {
    const body = await request.json();
    // @ts-ignore
    const { fileContent, contentId, model = 'gemini-1.5' } = body;

    // const cachedSummary = await getCachedSummary(contentId);
    // if (cachedSummary) {
    //   return new Response(JSON.stringify({ summary: cachedSummary }), {
    //     status: 200,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    // }

    const geminiModel = genAI.getGenerativeModel({ model });
    const result = await geminiModel.generateContent(fileContent);
    const response = await result.response;
    const summary = response.text();

    // await cacheSummary(contentId, summary);

    return new Response(JSON.stringify({ summary }), {
      status: 200,
    });
  } catch {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
