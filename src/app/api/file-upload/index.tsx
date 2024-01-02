import SPARKED_PROCESS_CODES from "app/shared/processCodes";
// import { NextApiRequest } from "next";
import { Session } from "next-auth";
import formidable, { errors as formidableErrors } from "formidable";
import { NextRequest } from "next/server";

const multer = require("multer");


  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage }).any();
// import { BSON } from "realm";
// const fs = require("fs");


// const formidableParse = async (req: Request) =>
//   new Promise((resolve, reject) =>
//     //@ts-ignore
//     new formidable.IncomingForm().parse(req, (err, fields, files) =>
//       err ? reject(err) : resolve([fields, files])
//     )
//   );

export default async function uploadFile_(req: Request, session?: Session) {
      const form = formidable({});

      let fields;
      let files;
     
      // [fields, files] = await form.parse(nextApi);

          const formData = await req.formData();
  const file = formData.get("file");


  console.log("fields =>", file);

  const response = {
    isError: true,
    code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
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