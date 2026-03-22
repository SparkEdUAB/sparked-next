import { describe, it, expect } from 'vitest';
import { convertListToText } from './convertListToText';

describe('convertListToText', () => {
  it('returns empty string for empty array', () => {
    expect(convertListToText([])).toBe('');
  });

  it('capitalizes single item', () => {
    expect(convertListToText(['apple'])).toBe('Apple');
  });

  it('joins two items with "or"', () => {
    expect(convertListToText(['apple', 'banana'])).toBe('Apple or Banana');
  });

  it('joins 3+ items with Oxford comma and "or"', () => {
    expect(convertListToText(['apple', 'banana', 'cherry'])).toBe('Apple, Banana, or Cherry');
  });
});
