import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';

type T_s3Upload = {
  file: Buffer;
  fileName: string;
  ext: string;
};

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_LOCAL as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
};

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials,
});

async function uploadFile({ file, fileName, ext }: T_s3Upload) {
  try {
    const imageUrl = getKeyName({ name: fileName, ext });
    const uploadParams = {
      Bucket: process.env.S3_BUCKET,
      Key: imageUrl,
      Body: file,
      ACL: 'public-read' as ObjectCannedACL,
    };

    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(uploadCommand);
    return `${process.env.S3_BUCKET_NAME_URL}/${imageUrl}`;
  } catch (error) {
    throw error;
  }
}

const today = new Date().getTime();

const getKeyName = ({ name, ext }: { name: string; ext: string }) =>
  `${process.env.S3_MEDIA_CONTENT_FOLDER}/${name}-${today}.${ext}`;

export default uploadFile;
