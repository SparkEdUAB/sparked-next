import useSWRInfinite from 'swr/infinite';
import { fetcher } from '@hooks/use-swr/fetcher';
import { MEDIA_CONTENT_LIMIT } from '@components/library/constants';
import { getSearchMediaUrl } from 'fetchers/library/searchMedia';

export function useSearchMediaSWR(searchText: string, sort_by: string = '', grade_id: string = '') {
  const getKey = (pageIndex: number, previousPageData: any) => {
    // Reached the end
    if (previousPageData && !previousPageData.mediaContent?.length) return null;

    return getSearchMediaUrl(pageIndex * MEDIA_CONTENT_LIMIT, searchText, sort_by, grade_id);
  };

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    (url) => fetcher(url, { next: { revalidate: 60 } }),
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    },
  );

  const mediaContent = data ? data.flatMap((page) => page.mediaContent || []) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.mediaContent?.length === 0;
  const hasMore = !isEmpty && data && data[data.length - 1]?.mediaContent?.length >= MEDIA_CONTENT_LIMIT;

  const loadMore = async () => {
    if (!isLoadingMore && hasMore) {
      setSize(size + 1);
    }
  };

  return {
    mediaContent,
    error,
    isLoadingInitialData,
    isLoadingMore,
    isEmpty,
    hasMore,
    loadMore,
    isValidating,
    mutate,
    size,
  };
}
