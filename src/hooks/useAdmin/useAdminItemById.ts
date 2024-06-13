import { useFetch } from '@hooks/use-swr';
import { useToastMessage } from 'providers/ToastMessageContext';
import { useMemo } from 'react';
import NETWORK_UTILS from 'utils/network';

export function useAdminItemById<Result extends object, RawData extends object>(
  url: string,
  id: string,
  objectType: string,
  transformRawData: (i: RawData, index: number) => Result,
) {
  const message = useToastMessage();

  const { data, isLoading, mutate } = useFetch(
    id ? url + NETWORK_UTILS.formatGetParams({ [objectType + 'Id']: id, withMetaData: 'false' }) : undefined,
  );

  const item: Result | null | Error = useMemo(() => {
    if (data instanceof Error) {
      message.error(data.message);
      return data;
    }
    return !data || !data[objectType] ? null : transformRawData(data[objectType], 0);
  }, [data, objectType, transformRawData, message]);

  return { item, isLoading, mutate };
}
