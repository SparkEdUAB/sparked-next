import { Session } from "next-auth";
import s3Upload from "./s3";
import MEDIA_PROCESS_CODES from "./processCodes";

export default async function uploadFile_(req: Request, session?: Session) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    let ext = file?.type.split("/")[1];

    let arrayBuffer = await file?.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const url = await s3Upload({
      file: buffer,
      fileName: file.name.substring(0, file.name.lastIndexOf(".")),
      ext,
    });

    const response = {
      isError: false,
      code: MEDIA_PROCESS_CODES.METHOD_NOT_FOUND,
      url,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    const response = {
      isError: true,
      code: MEDIA_PROCESS_CODES.METHOD_NOT_FOUND,
    };
    return new Response(JSON.stringify(response), {
      status: 200,
    });
  }
}


