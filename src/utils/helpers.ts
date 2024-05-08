import { DEFAULT_OPEN_GRAPH_PREVIEW } from 'app/shared/constants';
import { Metadata, ResolvingMetadata } from 'next';
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

/**
 * Handles some boilerplate of prefilling the list of OpenGraph images with those
 * of the parent or with the default OpenGraph preview image for the project. It also
 * automatically duplicates the `title` and `description` between the page's own
 * metadata and the Open Graph metadata, to save some keystrokes.
 *
 * More on Metadata generation in NextJS: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
 *
 * @param parent The metadata of the parent view
 * @returns A function which generates the metadata
 */
export async function getMetadataGenerator(parent: ResolvingMetadata) {
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [DEFAULT_OPEN_GRAPH_PREVIEW];

  return (title: string, description: string, thumbnail: string | undefined = undefined): Metadata => ({
    title,
    description,
    openGraph: {
      title,
      description,
      images: thumbnail ? [thumbnail, ...previousImages] : [...previousImages],
    },
  });
}
