import React from 'react';
import EmptyContentIndicator from '@components/library/EmptyContentIndicator';
import { getMetadataGenerator } from 'utils/helpers';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { T_LibrarySearchPageProps } from '@components/library/types';
import { Metadata, ResolvingMetadata } from 'next';
import { searchMedia } from 'fetchers/library/searchMedia';
import { SearchMediaContentList } from './SearchMediaContentList';

export async function generateMetadata(props: T_LibrarySearchPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const getMetadata = await getMetadataGenerator(parent);

  const title = `Searching for “${props.searchParams.q}”`;
  const description = `See the library content related to “${props.searchParams.q}”`;

  return getMetadata(title, description);
}

const LibrarySearchPage = async ({ searchParams }: T_LibrarySearchPageProps) => {
  const result = await searchMedia(0, searchParams.q);

  return (
    <main className="overflow-y-scroll custom-scrollbar h-[calc(100vh_-_62px)]">
      {result instanceof Error ? (
        <LibraryErrorMessage>{result.message}</LibraryErrorMessage>
      ) : !(result.mediaContent instanceof Array) ? (
        <LibraryErrorMessage>
          An error occured while fetching data (Unexpected data received):{' '}
          <code>{JSON.stringify(result, null, 4)}</code>
        </LibraryErrorMessage>
      ) : result.mediaContent.length === 0 ? (
        <EmptyContentIndicator>There is nothing here yet</EmptyContentIndicator>
      ) : (
        <SearchMediaContentList initialMediaContent={result.mediaContent} />
      )}
    </main>
  );
};

export default LibrarySearchPage;
