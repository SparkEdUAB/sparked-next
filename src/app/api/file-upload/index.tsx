import { Session } from 'next-auth';
import s3Upload from './s3';
import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { writeFile } from 'fs/promises'
import { join } from 'path'

const RENDER_URL = "onrender.com"
export default async function uploadFile_(req: Request, session?: Session) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;

    let ext = file?.type.split('/')[1];

    let arrayBuffer = await file?.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    // check if this is running on serverless or full server
    let url = ""
    const isOnRender = req.url?.includes(RENDER_URL) // If true then this is serverless and we won't have access to disk
    if (!isOnRender) {
      url = join(process.cwd(), 'public/uploads', file.name)
      await writeFile(url, buffer)
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
      status: 200,
    });
  } catch (error) {
    const response = {
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };
    return new Response(JSON.stringify(response), {
      status: 500,
    });
  }
}
