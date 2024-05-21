import useSWRInfinite from 'swr/infinite';
import { message } from 'antd';
import { useMemo, useState } from 'react';
import NETWORK_UTILS from 'utils/network';
import { fetcher } from '@hooks/use-swr/fetcher';

const ITEMS_PER_PAGE = 100;

export function useAdminListViewData<Result extends Record<string, any>, RawData extends Record<string, any>>(
  url: string,
  field: string,
  transformRawData: (i: RawData, index: number) => Result,
  searchUrl?: string,
  searchQuery?: string,
) {
  const [hasMore, setHasMore] = useState(true);

  const getKey = (index: number) => {
    if (searchQuery && searchUrl) {
      return (
        searchUrl +
        NETWORK_UTILS.formatGetParams({
          name: searchQuery,
          limit: ITEMS_PER_PAGE.toString(),
          skip: (ITEMS_PER_PAGE * index).toString(),
          withMetaData: 'false',
        })
      );
    } else {
      return (
        url +
        NETWORK_UTILS.formatGetParams({
          limit: ITEMS_PER_PAGE.toString(),
          skip: (ITEMS_PER_PAGE * index).toString(),
          withMetaData: 'false',
        })
      );
    }
  };

  const infiniteFetcher = async (input: RequestInfo, init?: RequestInit) => {
    setHasMore(true);

    const result = await fetcher<Record<string, any>>(input, init);

    if (result instanceof Error) {
      message.error(result.message);
      setHasMore(false);
      throw result;
    } else {
      const data = result[field] as RawData[];
      if (data.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }
      return data;
    }
  };

  const { data, isLoading, mutate, size, setSize, error, isValidating } = useSWRInfinite(getKey, infiniteFetcher);

  const loadMore = () => {
    setSize((value) => value + 1);
  };

  const items: Result[] = useMemo(
    () =>
      (
        data?.reduce<RawData[]>(
          (previous, current) => (current instanceof Error ? previous : [...previous, ...current]),
          [],
        ) || []
      ).map(transformRawData),
    [data],
  );

  return { items, isLoading, mutate, size, error, loadMore, hasMore, isValidating };
}
