import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useSearchQuery = () => {
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === '') {
        params.delete(name);
      }
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  return { createQueryString };
};
