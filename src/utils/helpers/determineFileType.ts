export type AcceptableFileTypes = 'image' | 'video' | 'pdf';

export function determineFileType(fileUrl: string): AcceptableFileTypes | null {
  let extension = fileUrl.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
    case 'svg':
      return 'image';
    case 'mp4':
    case 'webm':
    case 'ogg':
      return 'video';
    case 'pdf':
      return 'pdf';
    default:
      return null;
  }
}
