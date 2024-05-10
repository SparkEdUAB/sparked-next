import { useFetch } from '@hooks/use-swr';
import { message } from 'antd';
import { useMemo } from 'react';
import NETWORK_UTILS from 'utils/network';

export function useAdminListViewData<Result extends object, RawData extends object>(
  url: string,
  field: string,
  transformRawData: (i: RawData, index: number) => Result,
  searchUrl?: string,
  searchQuery?: string,
) {
  const { data, isLoading, mutate } = useFetch(
    searchQuery && searchUrl
      ? searchUrl + NETWORK_UTILS.formatGetParams({ name: searchQuery, limit: '100', skip: '0', withMetaData: 'false' })
      : url + NETWORK_UTILS.formatGetParams({ limit: '100', skip: '0', withMetaData: 'false' }),
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
