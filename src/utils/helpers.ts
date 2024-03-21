import { FormEvent } from 'react';

export const toTitleCase = (text: string) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function extractValuesFromFormEvent<DataType extends Record<string, any>>(
  e: FormEvent<HTMLFormElement>,
  keys: string[],
) {
  const form = e.target as HTMLFormElement;

  let result: Record<string, string> = {};

  for (let key of keys) {
    result[key] = (form.elements.namedItem(key) as HTMLInputElement).value;
  }
  return result as DataType;
}
