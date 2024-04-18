import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { p_fetchMediaContentWithMetaData, p_fetchRandomMediaContent } from './pipelines';
// import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

// export default async function fetchMediaContent_(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'GET') {
//     res.status(405).end(); // Method Not Allowed
//     return;
//   }

//   const schema = z.object({
//     limit: z.number().optional(),
//     skip: z.number().optional(),
//     withMetaData: z.boolean().optional(),
//   });

//   // const { limit, skip, withMetaData } = req.query; //schema.parse(req.query);

//   console.log('=======================fetchMediaContent_ =================================');
//   console.log(res.json({ message: 'fetchMediaContent_' }));
//   try {
//     const db = await dbClient();

//     if (!db) {
//       const response = {
//         isError: true,
//         code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
//       };
//       return res.status(200).json(response);
//     }
//     let mediaContent = [];

//     mediaContent = await db.collection(dbCollections.media_content.name).find({}).toArray();

//     const response = {
//       isError: false,
//       mediaContent,
//     };

//     return res.status(200).json(response);
//   } catch (error) {
//     const resp = {
//       isError: true,
//       code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
//     };

//     return res.status(200).json(resp);
//   }
// }

export async function GET() {
  let response;
  try {
    response = {
      isError: false,
      mediaContent: [
        {
          _id: '1',
          name: 'Media Content 1',
          description: 'Media Content 1 Description',
          unitId: '1',
          schoolId: '1',
          programId: '1',
          courseId: '1',
          topicId: '1',
          fileUrl: 'https://www.google.com',
        },
        {
          _id: '2',
          name: 'Media Content 2',
          description: 'Media Content 2 Description',
          unitId: '2',
          schoolId: '2',
          programId: '2',
          courseId: '2',
          topicId: '2',
          fileUrl: 'https://www.google.com',
        },
      ],
    };
    return Response.json(response);
  } catch (error) {
    return Response.json(error);
  }
}
