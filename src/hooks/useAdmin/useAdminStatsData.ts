import useSWRInfinite from 'swr/infinite';
import { useCallback, useMemo, useState } from 'react';
import NETWORK_UTILS from 'utils/network';
import { fetcher } from '@hooks/use-swr/fetcher';
import { useToastMessage } from 'providers/ToastMessageContext';
import { T_RawStatsFields, T_StatFields } from './types';

const ITEMS_PER_PAGE = 100;

/**
 * This will only work well when we have cursor based pagination on the backend, right now it is hard to tell if there's more data to be fetched
 */
export function useAdminStatsData<Result extends Record<string, any>, RawData extends Record<string, any>>(
  url: string,
  field: string,
  transformRawData: (i: RawData, index: number) => Result,
  searchUrl?: string,
  searchQuery?: string,
) {
  const [hasMore, setHasMore] = useState(true);
  const message = useToastMessage();

  const getKey = useCallback(
    (index: number) => {
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
    },
    [searchQuery, searchUrl, url],
  );

  const infiniteFetcher = useCallback(
    async (input: RequestInfo, init?: RequestInit) => {
      const result = await fetcher<Record<string, any>>(input, init);

      if (result instanceof Error) {
        message.error(result.message);
        setHasMore(false);
        throw result;
      } else {
        const data = result[field] as RawData[];
        if (data.length < ITEMS_PER_PAGE) {
          setHasMore(false);
          return data;
        }
        setHasMore(true); // TODO: Needs to be revisited
        return data;
      }
    },
    [field, message],
  );

  const { data, isLoading, mutate, size, setSize, error, isValidating } = useSWRInfinite(getKey, infiniteFetcher);

  const loadMore = useCallback(() => {
    setSize((value) => value + 1);
  }, [setSize]);

  const items: Result[] = useMemo(
    () =>
      (
        data?.reduce<RawData[]>(
          (previous, current) => (current instanceof Error ? previous : [...previous, ...current]),
          [],
        ) || []
      ).map(transformRawData),
    [data, transformRawData],
  );

  return { items, isLoading, mutate, size, error, loadMore, hasMore, isValidating };
}

export function transformRawStats(stat: T_RawStatsFields, index: number = 0): T_StatFields {
  return {
    index: index + 1,
    name: stat.name,
    value: stat.value,
    isPercentage: stat.isPercentage,
    percentageTrend: stat.percentageTrend,
  };
}
