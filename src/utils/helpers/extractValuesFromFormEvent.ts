import { FormEvent } from 'react';

/**
 * Extracts the values from a form event based on specified keys
 *
 * @param event The form event
 * @param keys A list of keys to extract values for
 */
export function extractValuesFromFormEvent<DataType extends Record<string, any>>(
  event: FormEvent<HTMLFormElement>,
  keys: string[],
) {
  const form = event.target as HTMLFormElement;

  let result: Record<string, string> = {};

  for (let key of keys) {
    result[key] = (form.elements.namedItem(key) as HTMLInputElement).value;
  }
  return result as DataType;
}
