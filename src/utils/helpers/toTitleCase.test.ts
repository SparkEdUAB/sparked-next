import { describe, it, expect } from 'vitest';
import { toTitleCase } from './toTitleCase';

describe('toTitleCase', () => {
  it('converts lowercase words to title case', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
  });

  it('converts ALL CAPS to title case', () => {
    expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
  });

  it('handles single word', () => {
    expect(toTitleCase('hello')).toBe('Hello');
  });

  it('returns empty string for empty input', () => {
    expect(toTitleCase('')).toBe('');
  });
});
