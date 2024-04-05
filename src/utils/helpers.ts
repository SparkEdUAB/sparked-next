import { FormEvent } from 'react';

export const toTitleCase = (text: string) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function extractValuesFromFormEvent<DataType extends Record<string, any>>(
  e: FormEvent<HTMLFormElement>,
  keys: string[],
) {
  const form = e.target as HTMLFormElement;

  let result: Record<string, string> = {};

  for (let key of keys) {
    result[key] = (form.elements.namedItem(key) as HTMLInputElement).value;
  }
  return result as DataType;
}

export function determineFileType(fileUrl: string): 'image' | 'pdf' | 'video' | null {
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

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.slice(0, maxLength) + '...';
  }
}
