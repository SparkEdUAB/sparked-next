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

  return [...items].sort((a, b) => {
    const aField = a[field];
    const bField = b[field];

    const aValue = typeof aField === 'string' ? aField : String(aField || '');
    const bValue = typeof bField === 'string' ? bField : String(bField || '');

    const aPrefix = aValue.replace(/\d+/g, '').trim();
    const bPrefix = bValue.replace(/\d+/g, '').trim();

    if (aPrefix !== bPrefix) {
      return aPrefix.localeCompare(bPrefix);
    }

    const numA = parseInt(aValue.replace(/\D/g, '')) || 0;
    const numB = parseInt(bValue.replace(/\D/g, '')) || 0;

    return numA - numB;
  });
}
