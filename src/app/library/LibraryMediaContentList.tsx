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
  
  // Make sure we're passing the externalContent parameter correctly
  if (externalContent === 'true') {
    filters = {
      ...filters,
      externalUrl: 'true'
    };
    
    // Log to verify the filter is being set correctly
    console.log('External content filter applied:', filters);
  }

  let { error, hasMore, loadMore, mediaContent, resetData } = useLibraryInfiniteScroll(
    initialMediaContent,
    async (offset) => await fetchMedia(offset, filters),
  );

  // Reset data when externalContent changes
  useEffect(() => {
    resetData(initialMediaContent);
  }, [externalContent, initialMediaContent, resetData]);

  return <LibraryInfiniteScrollList mediaContent={mediaContent} loadMore={loadMore} hasMore={hasMore} error={error} />;
}
