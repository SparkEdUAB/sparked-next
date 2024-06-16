import { S3 } from '@aws-sdk/client-s3';

type T_s3Upload = {
  file: Buffer;
  fileName: string;
  ext: string;
};

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_LOCAL as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
};
const s3Upload = ({ file, fileName, ext }: T_s3Upload) =>
  new Promise((resolve, reject) => {
    let imageUrl = getKeyName({ name: fileName, ext });

    var objectParams: any = {
      Bucket: process.env.S3_BUCKET,
      Key: imageUrl,
      Body: file,
      ACL: 'public-read',
    };

    var uploadPromise = new S3({
      credentials,
    }).putObject(objectParams);
    uploadPromise
      .then(function () {
        imageUrl = `${process.env.S3_BUCKET_NAME_URL}/${imageUrl}`;

        resolve(imageUrl);
      })
      .catch((err) => {
        reject(err);
      });
  });

const today = new Date().getTime();

const getKeyName = ({ name, ext }: { name: string; ext: string }) =>
  `${process.env.S3_MEDIA_CONTENT_FOLDER}/${name}-${today}.${ext}`;

export default s3Upload;
