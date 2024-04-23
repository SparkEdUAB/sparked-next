import useSWR from 'swr';

export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

export const useFetch = (key: string) => {
  return useSWR(key, fetcher);
};
