import AWS from "aws-sdk";
import fs from "fs";

export function s3Upload({ file, name, ext }) {
  return new Promise((resolve, reject) => {
    // Create params for putObject call

    // const ext = file.mimetype.split('/')[1];
    let imageUrl = getkeyName({ name, ext });

    // var buffer = fs.readFileSync(file);




    console.log("imageUrl", imageUrl, "ext", ext);
    var objectParams = {
      Bucket: process.env.S3_BUCKET,
      Key: imageUrl,
      Body: file,
      ACL: "public-read",
    };

    var uploadPromise = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      apiVersion: "2006-03-01",
    })
      .putObject(objectParams)
      .promise();
    uploadPromise
      .then(function (data) {
        // NOTE:// ?${new Date()} is added to force react-native to load new images

        //https://warma-paperless-registry.s3.us-east-2.amazonaws.com/media-content/sparked-testupload-1704303918946.jpeg

        imageUrl = `https://warma-paperless-registry.s3.us-east-2.amazonaws.com/${imageUrl}`;
        // imageUrl = `${process.env.S3_BUCKET_NAME_URL}/${imageUrl}`;

        // const imageUrl = "Successfully uploaded data to " + S3_BUCKET_NAME_URL + "/" + keyName;

        resolve(imageUrl);
        console.log("Successfully uploaded data to " + imageUrl);
      })
      .catch((err) => {
        console.log("uploadFile():err", err);
        reject(err);
      });
  });
}

const today = new Date().getTime();

const getkeyName = ({ name, ext }) => `media-content/${name}-${today}.${ext}`;
