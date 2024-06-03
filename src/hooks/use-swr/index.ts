'use client';

import useSWR from 'swr';
import { fetcher } from './fetcher';

export const useFetch = <Data = any>(key?: string) => {
  return useSWR<Data | Error>(key, fetcher as any);
};
