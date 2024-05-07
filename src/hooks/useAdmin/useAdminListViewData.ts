import { useFetch } from '@hooks/use-swr';
import { message } from 'antd';
import { useMemo } from 'react';
import NETWORK_UTILS from 'utils/network';

export function useAdminListViewData<Result extends object, RawData extends object>(
  url: string,
  field: string,
  transformRawData: (i: RawData, index: number) => Result,
  searchQuery?: string,
) {
  const searchQueryObject: { name: string } | {} = searchQuery ? { name: searchQuery } : {};

  const { data, isLoading, mutate } = useFetch(
    url + NETWORK_UTILS.formatGetParams({ ...searchQueryObject, limit: '100', skip: '0', withMetaData: 'false' }),
  );

  const items: Result[] = useMemo(() => {
    if (data instanceof Error) {
      message.error(data.message);
    }
    return !data || data instanceof Error || !data[field] || !(data[field] instanceof Array)
      ? []
      : data[field].map(transformRawData);
  }, [data, field, transformRawData]);

  return { items, isLoading, mutate };
}
