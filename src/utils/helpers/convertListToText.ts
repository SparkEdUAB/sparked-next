import { capitalizeFirstLetter } from './capitalizeFirstLetter';

/**
 * Converts a list of strings to a plain text English list of them
 *
 * @param items List of words or phrases
 */
export function convertListToText(items: string[]): string {
  const length = items.length;

  if (length === 0) {
    return '';
  } else if (length === 1) {
    return capitalizeFirstLetter(items[0]);
  } else if (length === 2) {
    return `${capitalizeFirstLetter(items[0])} or ${capitalizeFirstLetter(items[1])}`;
  } else {
    const firstPart = items
      .slice(0, length - 1)
      .map(capitalizeFirstLetter)
      .join(', ');

    const lastItem = capitalizeFirstLetter(items[length - 1]);
    return `${firstPart}, or ${lastItem}`;
  }
}
