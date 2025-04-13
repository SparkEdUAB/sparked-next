/**
 * Extracts a numeric value from a string field and sorts items accordingly
 * Used for sorting items like "Grade 1", "Grade 10" in correct numeric order
 * Falls back to alphabetical sorting when numeric values are equal
 *
 * @param items Array of objects to sort
 * @param field The field name containing the value to extract numbers from
 * @returns Sorted array
 */
export function sortByNumericValue<T extends Record<string, any>>(items: T[], field: keyof T): T[] {
  if (!items || !items.length) {
    return [];
  }

  const cache = new Map<T, { prefix: string; num: number }>();

  const getSortData = (item: T) => {
    if (cache.has(item)) {
      return cache.get(item)!;
    }

    const fieldValue = item[field];
    const strValue = typeof fieldValue === 'string' ? fieldValue : String(fieldValue || '');
    const prefix = strValue.replace(/\d+/g, '').trim();
    const num = parseInt(strValue.replace(/\D/g, '')) || 0;

    const data = { prefix, num };
    cache.set(item, data);
    return data;
  };

  return [...items].sort((a, b) => {
    const aData = getSortData(a);
    const bData = getSortData(b);

    return aData.prefix.localeCompare(bData.prefix) || aData.num - bData.num;
  });
}
