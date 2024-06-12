/**
 * Cuts off text to a maximum length if it's too long
 *
 * @param text The text
 * @param maxLength The maximum length
 */
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.slice(0, maxLength) + '...';
  }
}
