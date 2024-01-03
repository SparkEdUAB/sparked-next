import SPARKED_PROCESS_CODES from "app/shared/processCodes";
// import { NextApiRequest } from "next";
import { Session } from "next-auth";
import formidable, { errors as formidableErrors } from "formidable";
import { s3Upload } from "./s3";

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).any();

export default async function uploadFile_(req: Request, session?: Session) {
  const form = formidable({});

  let fields;
  let files;

  const formData = await req.formData();
  const file = formData.get("file");

  console.log("fields =>", file);

   let ext = file.type.split("/")[1];

    let arrayBuffer = await file?.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    

   const url = await s3Upload({
     file: buffer,
     name: "sparked-testupload",
     ext,
   });


  const response = {
    isError: true,
    code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    url,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
