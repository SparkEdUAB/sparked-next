import s3Upload from './s3';
import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { HttpStatusCode } from 'axios';
import { writeFile } from 'fs/promises';
import { join, basename } from 'path';

const RENDER_URL = 'onrender.com';

export default async function uploadFile_(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    let ext = file?.type.split('/')[1];

    let arrayBuffer = await file?.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    // check if this is running on serverless or full server
    let url = '';
    const isOnRender = true; //request.url?.includes(RENDER_URL); // Temporarily disable to always upload to S3

    if (!isOnRender) {
      const sanitizedFilename = basename(file.name).replace(/[^a-zA-Z0-9.-]/g, '_');

      const savePath = join(process.cwd(), 'public', 'uploads', sanitizedFilename);
      await writeFile(savePath, buffer);
      url = `/uploads/${sanitizedFilename}`;
    } else {
      url = await s3Upload({
        file: buffer,
        fileName: file.name.substring(0, file.name.lastIndexOf('.')),
        ext,
      });
    }

    const response = {
      isError: false,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
      url,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch (error) {
    const response = {
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };
    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
