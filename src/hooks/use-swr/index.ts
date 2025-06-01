'use client';

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetcher, postMutationFetcher } from './fetcher';
import { useToastMessage } from 'providers/ToastMessageContext';
import i18next from 'i18next';

export const useFetch = <Data = any>(key?: string | null) => {
  return useSWR<Data | Error>(key, fetcher as any, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateOnMount: true,
  });
};

export const useActionMutation = (url: string) => {
  const message = useToastMessage();
  return useSWRMutation(url, postMutationFetcher, {
    onSuccess: () => {
      message.success(i18next.t('Successfully updated'));
    },
    onError: (error) => {
      message.warning(error.message || 'An error occurred');
    },
  });
};
