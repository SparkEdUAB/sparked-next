'use client';
import { AcceptableFileTypes } from 'utils/helpers/determineFileType';
import { Accept } from 'react-dropzone';

/**
 * Creates an object for specifying the file types that
 * should be accepted by a dropzone file input field
 *
 * @param fileTypes The acceptable file types
 */
export function getDropzoneAcceptValue(fileTypes: AcceptableFileTypes[]): Accept {
  let accept: Accept = {};

  if (fileTypes.includes('image')) {
    accept['image/*'] = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  }
  if (fileTypes.includes('video')) {
    accept['video/*'] = ['.mp4', '.webm', '.ogg'];
  }
  if (fileTypes.includes('pdf')) {
    accept['application/pdf'] = ['.pdf'];
  }

  return accept;
}
