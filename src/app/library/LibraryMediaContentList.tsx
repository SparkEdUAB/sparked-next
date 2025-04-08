'use client';

import React, { useEffect } from 'react';
import { T_RawMediaContentFields } from 'types/media-content';
import { fetchMedia } from 'fetchers/library/fetchMedia';
import useSearchFilters from '@hooks/useLibrary/useSearchFilters';
import { useLibraryInfiniteScroll } from '../../hooks/useLibrary/useLibraryInfiniteScroll';
import { LibraryInfiniteScrollList } from '../../components/library/LibraryInfiniteScrollList';
import { useSearchParams } from 'next/navigation';

export default function LibraryMediaContentList({
  initialMediaContent,
}: {
  initialMediaContent: T_RawMediaContentFields[];
}) {
  const searchParams = useSearchParams();
  const externalContent = searchParams.get('externalContent');

  let filters = useSearchFilters();

  if (externalContent === 'true') {
    filters = {
      ...filters,
      externalUrl: 'true',
    };
  }

  let { error, hasMore, loadMore, mediaContent, resetData } = useLibraryInfiniteScroll(
    initialMediaContent,
    async (offset) => await fetchMedia(offset, filters),
  );

  useEffect(() => {
    resetData(initialMediaContent);
  }, [externalContent, initialMediaContent, resetData]);

  return <LibraryInfiniteScrollList mediaContent={mediaContent} loadMore={loadMore} hasMore={hasMore} error={error} />;
}
