'use client';

import React from 'react';
import { T_RawMediaContentFields } from 'types/media-content';
import { useLibraryInfiniteScroll } from '@hooks/useLibrary/useLibraryInfiniteScroll';
import { searchMedia } from 'fetchers/library/searchMedia';
import { useSearchParams } from 'next/navigation';
import { LibraryInfiniteScrollList } from '@components/library/LibraryInfiniteScrollList';

export function SearchMediaContentList({ initialMediaContent }: { initialMediaContent: T_RawMediaContentFields[] }) {
  let params = useSearchParams();
  const searchTerm = params.get('q') || '';

  let { error, hasMore, loadMore, mediaContent } = useLibraryInfiniteScroll(initialMediaContent, async (offset) =>
    searchMedia(offset, searchTerm),
  );

  return (
    <>
      <p className="ml-3">
        Showing results for <b>{searchTerm}</b>
      </p>
      <LibraryInfiniteScrollList mediaContent={mediaContent} loadMore={loadMore} hasMore={hasMore} error={error} />
    </>
  );
}
