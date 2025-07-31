import React from 'react';
import EmptyContentIndicator from '@components/library/EmptyContentIndicator';
import { getMetadataGenerator } from 'utils/helpers/getMetadataGenerator';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { Metadata, ResolvingMetadata } from 'next';
import { T_LibraryPageProps } from '@components/library/types';
import LibraryMediaContentList from './LibraryMediaContentList';
import { fetchMedia } from 'fetchers/library/fetchMedia';

export async function generateMetadata(props: {}, parent: ResolvingMetadata): Promise<Metadata> {
  const getMetadata = await getMetadataGenerator(parent);

  return getMetadata('Library Content', 'View the list of media content on the site');
}

const LibraryPage = async ({ searchParams: searchParamsPromise }: T_LibraryPageProps) => {
  const searchParams = await searchParamsPromise;
  const mediaResult = await fetchMedia(0, searchParams);

  return (
    <main id="scrollableDiv" className="overflow-y-scroll custom-scrollbar h-[calc(100vh_-_62px)] min-w-full mt-3">
      {mediaResult instanceof Error ? (
        <LibraryErrorMessage>{mediaResult.message}</LibraryErrorMessage>
      ) : !(mediaResult.mediaContent instanceof Array) ? (
        <LibraryErrorMessage>
          An error occured while fetching data (Unexpected data received):{' '}
          <code>{JSON.stringify(mediaResult, null, 4)}</code>
        </LibraryErrorMessage>
      ) : mediaResult.mediaContent.length === 0 ? (
        <EmptyContentIndicator>There is no content here yet</EmptyContentIndicator>
      ) : (
        <LibraryMediaContentList initialMediaContent={mediaResult.mediaContent} />
      )}
    </main>
  );
};

export default LibraryPage;
