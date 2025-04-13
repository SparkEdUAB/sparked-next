import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
  CopyObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

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
    const contentType = getContentType(ext);
    const uploadParams = {
      Bucket: process.env.S3_BUCKET,
      Key: imageUrl,
      Body: file,
      ACL: 'public-read' as ObjectCannedACL,
      ContentType: contentType,
      ContentDisposition: `inline; filename="${encodeURIComponent(fileName)}.${ext}"`,
    };

    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(uploadCommand);
    return `${process.env.S3_BUCKET_NAME_URL}/${imageUrl}`;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw to handle in calling code
  }
}

function getContentType(ext: string): string {
  const typeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    pdf: 'application/pdf',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    zip: 'application/zip',
    txt: 'text/plain',
    csv: 'text/csv',
    json: 'application/json',
  };

  return typeMap[ext.toLowerCase()] || 'application/octet-stream';
}

const today = new Date().getTime();

const getKeyName = ({ name, ext }: { name: string; ext: string }) =>
  `${process.env.S3_MEDIA_CONTENT_FOLDER}/${name}-${today}.${ext}`;

// This is used for some files that have incorrect content types hence not displaying properly in the browser
export async function updateContentType(key: string) {
  try {
    const ext = key.split('.').pop()?.toLowerCase() || '';
    const contentType = getContentType(ext);

    const encodedKey = encodeURIComponent(key);

    const copyParams = {
      Bucket: process.env.S3_BUCKET,
      CopySource: `${process.env.S3_BUCKET}/${encodedKey}`,
      Key: key,
      ContentType: contentType,
      MetadataDirective: 'REPLACE' as const,
      ACL: 'public-read' as ObjectCannedACL,
    };

    await s3Client.send(new CopyObjectCommand(copyParams));
    return true;
  } catch (error) {
    console.error(`Failed to update content type for ${key}:`, error);
    throw error;
  }
}

export async function listAllFiles(prefix = process.env.S3_MEDIA_CONTENT_FOLDER) {
  const response = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET,
      Prefix: prefix,
    }),
  );
  return response.Contents?.map((obj) => obj.Key) || [];
}

export default uploadFile;
