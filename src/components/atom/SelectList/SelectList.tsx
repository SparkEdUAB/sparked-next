'use client';

import { useEffect, useState } from 'react';
import { Label, Spinner } from 'flowbite-react';
import { RedAsterisk } from '@components/atom';
import { useFetch } from '@hooks/use-swr';

type ItemType = {
  _id: string;
  name: string;
  [key: string]: any;
};

interface SelectListProps<T extends ItemType> {
  url: string;
  handleSelect: (item: T | null) => void;
  moduleName: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  selectedItem?: T | null;
  placeholder?: string;
  className?: string;
  queryParams?: Record<string, string>;
}

const SelectList = <T extends ItemType>({
  url,
  handleSelect,
  moduleName,
  label,
  required = false,
  disabled = false,
  selectedItem = null,
  placeholder = 'Select an option',
  className = '',
  queryParams = {},
}: SelectListProps<T>) => {
  const [selected, setSelected] = useState<T | null>(selectedItem);

  // Build the query string for the URL
  const queryString = Object.entries(queryParams)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  // Only fetch if it's grades or if there are valid query parameters
  const shouldFetch = moduleName === 'grades' || Object.values(queryParams).some((value) => !!value);

  const fullUrl = queryString ? `${url}?${queryString}` : url;
  const { data, isLoading } = useFetch(shouldFetch ? fullUrl : null);
  const items = data?.[moduleName] || [];

  useEffect(() => {
    setSelected(selectedItem);
  }, [selectedItem]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setSelected(null);
      handleSelect(null);
      return;
    }

    const item = items.find((item: T) => item._id === selectedId);
    if (item) {
      setSelected(item);
      handleSelect(item);
    }
  };

  const displayLabel = label || moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-2 block">
        <Label htmlFor={`select-${moduleName}`} className="cursor-pointer">
          {displayLabel} {required && <RedAsterisk />}
        </Label>
      </div>
      <div className="relative">
        <select
          id={`select-${moduleName}`}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleChange}
          disabled={disabled || isLoading}
          value={selected?._id || ''}
          required={required}
        >
          <option value="">{placeholder}</option>
          {items.map((item: T) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
        {isLoading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Spinner size="sm" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectList;
