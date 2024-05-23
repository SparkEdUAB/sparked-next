'use client';

import React from 'react';
import { T_RawMediaContentFields } from 'types/media-content';
import { fetchMedia } from 'fetchers/library/fetchMedia';
import useSearchFilters from '@hooks/useLibrary/useSearchFilters';
import { useLibraryInfiniteScroll } from '../../hooks/useLibrary/useLibraryInfiniteScroll';
import { LibraryInfiniteScrollList } from '../../components/library/LibraryInfiniteScrollList';

export default function LibraryMediaContentList({
  initialMediaContent,
}: {
  initialMediaContent: T_RawMediaContentFields[];
}) {
  let filters = useSearchFilters();

  let { error, hasMore, loadMore, mediaContent } = useLibraryInfiniteScroll(
    initialMediaContent,
    async (offset) => await fetchMedia(offset, filters),
  );

  return <LibraryInfiniteScrollList mediaContent={mediaContent} loadMore={loadMore} hasMore={hasMore} error={error} />;
}
