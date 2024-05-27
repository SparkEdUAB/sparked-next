import { useEffect, useState } from 'react';

// Borrowed from here https://github.com/OlivierJM/async-autocomplete/blob/main/src/hooks/use-debounced-value.ts
export default function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const delayHandler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(delayHandler);
    };
  }, [value, delay]);
  return debouncedValue;
}
