import { DEFAULT_OPEN_GRAPH_PREVIEW } from 'app/shared/constants';
import { Metadata, ResolvingMetadata } from 'next';

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
