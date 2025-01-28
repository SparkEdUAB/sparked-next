import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractTextFromFile } from 'utils/helpers/extractTextFromFile';
import { getCachedSummary, cacheSummary } from 'utils/helpers/summaryCache';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // @ts-ignore
    const { content, fileUrl, contentId, model = 'gemini-1.5' } = body;

    const cachedSummary = await getCachedSummary(contentId);
    if (cachedSummary) {
      return new Response(JSON.stringify({ summary: cachedSummary }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let textToSummarize = content;

    if (fileUrl) {
      textToSummarize = await extractTextFromFile(fileUrl);
    }

    if (!textToSummarize) {
      return new Response(JSON.stringify({ error: 'No content to summarize' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const geminiModel = genAI.getGenerativeModel({ model });
    const result = await geminiModel.generateContent(textToSummarize);
    const response = await result.response;
    const summary = response.text();

    await cacheSummary(contentId, summary);

    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to generate summary' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(req: Request) {
  return new Response(JSON.stringify({ message: 'Hello World' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
