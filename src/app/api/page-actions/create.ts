import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { Session } from 'next-auth';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import PAGE_ACTIONS_PROCESS_CODES from './processCodes';
import { HttpStatusCode } from 'axios';

import { GoogleGenerativeAI } from '@google/generative-ai';
// import { extractTextFromPdf } from 'utils/helpers/extractTextFromFile';
// import { extractTextFromFile } from 'utils/helpers/extractTextFromFile';

import fetch from 'node-fetch';
import pdf from 'pdf-parse';

/**
 * Extracts text content from a PDF file at the given URL.
 * @param {string} fileUrl - The URL of the PDF file.
 * @returns {Promise<string>} - The extracted text content.
 */
export async function extractTextFromFile(fileUrl: string): Promise<string> {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch the PDF file: ${response.statusText}`);
    }

    // Use response.body to stream the content
    // @ts-ignore
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Unable to read stream');
    }

    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Failed to extract text from the PDF file.');
  }
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || '');

export default async function createPageAction_(request: Request, session?: Session) {
  try {
    const formBody = await request.json();
    const { content, fileUrl, contentId, model = 'gemini-1.5' } = formBody;

    let textToSummarize = content;

    if (fileUrl) {
      console.log('Starting text extraction from:', fileUrl);
      textToSummarize = await extractTextFromFile(fileUrl);
      console.log('Extraction successful, text length:', textToSummarize.length);
      // try {
      // } catch (extractError) {
      //   console.error('Text extraction failed:', extractError);
      //   return new Response(
      //     JSON.stringify({
      //       error: 'Failed to extract text from PDF',
      //       // @ts-ignore
      //       details: extractError.message,
      //     }),
      //     {
      //       status: HttpStatusCode.BadRequest,
      //       // headers: { 'Content-Type': 'application/json' },
      //     },
      //   );
      // }
    }

    // if (!textToSummarize) {
    //   return new Response(JSON.stringify({ error: 'No content to summarize' }), {
    //     status: 400,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    // }

    console.log(textToSummarize);

    const response = {
      isError: false,
      code: PAGE_ACTIONS_PROCESS_CODES.PAGE_ACTION_CREATED,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
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
