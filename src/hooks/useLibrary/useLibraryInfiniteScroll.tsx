import { useCallback, useEffect, useState } from 'react';
import { T_RawMediaContentFields } from 'types/media-content';
import { MEDIA_CONTENT_LIMIT } from '../../components/library/constants';

export function useLibraryInfiniteScroll(
  initialMediaContent: T_RawMediaContentFields[],
  fetchData: (offset: number) => Promise<
    | {
        mediaContent: T_RawMediaContentFields[];
      }
    | Error
  >,
) {
  const [mediaContent, setMediaContent] = useState(initialMediaContent);
  const [offset, setOffset] = useState(MEDIA_CONTENT_LIMIT);
  const [hasMore, setHasMore] = useState(initialMediaContent.length >= MEDIA_CONTENT_LIMIT);
  const [error, setError] = useState(false);

  useEffect(() => {
    setMediaContent(initialMediaContent);
    setOffset(MEDIA_CONTENT_LIMIT);
    setHasMore(initialMediaContent.length >= MEDIA_CONTENT_LIMIT);
    setError(false);
  }, [initialMediaContent]);

  const resetData = useCallback((newInitialData: T_RawMediaContentFields[]) => {
    setMediaContent(newInitialData);
    setOffset(MEDIA_CONTENT_LIMIT);
    setHasMore(newInitialData.length >= MEDIA_CONTENT_LIMIT);
    setError(false);
  }, []);

  const loadMore = useCallback(async () => {
    try {
      const result = await fetchData(offset);

      if (result instanceof Error || !result.mediaContent || !(result.mediaContent instanceof Array)) {
        setError(true);
        setHasMore(false);
      } else if (result.mediaContent.length === 0) {
        setHasMore(false);
      } else {
        const newItems = (result as { mediaContent: T_RawMediaContentFields[] }).mediaContent;
        setMediaContent((existing) => [...existing, ...newItems]);
      }
    } catch {
      setError(true);
      setHasMore(false);
    }

    setOffset((offset) => offset + MEDIA_CONTENT_LIMIT);
  }, [fetchData, offset]);

  return {
    hasMore,
    loadMore,
    mediaContent,
    error,
    resetData,
  };
}
