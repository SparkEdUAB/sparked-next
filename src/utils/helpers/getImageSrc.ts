import { T_RawMediaContentFields } from 'types/media-content';
import { determineFileType } from './determineFileType';
import recoveredThumbnails from './recoveredThumbnails.json';

export function getImageSrc(item: T_RawMediaContentFields) {
  if (item.thumbnail_url) {
    return recoveredThumbnails[item.thumbnail_url as keyof typeof recoveredThumbnails] || item.thumbnail_url;
  }
  if (item.file_url) {
    if (item.file_url.includes('uploads')) {
      return `${item.file_url}`;
    }
    if (determineFileType(item.file_url) === 'image') {
      return item.file_url;
    }
  }
  return '/assets/images/no picture yet.svg';
}
