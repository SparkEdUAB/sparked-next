'use client';

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
  const filters = useSearchFilters();

  const { error, hasMore, loadMore, mediaContent } = useLibraryInfiniteScroll(
    initialMediaContent,
    (offset) => fetchMedia(offset, filters),
  );

  return <LibraryInfiniteScrollList mediaContent={mediaContent} loadMore={loadMore} hasMore={hasMore} error={error} />;
}
