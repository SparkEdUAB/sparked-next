import { describe, it, expect } from 'vitest';
import { capitalizeFirstLetter } from './capitalizeFirstLetter';

describe('capitalizeFirstLetter', () => {
  it('capitalizes lowercase word', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
  });

  it('keeps already capitalized word', () => {
    expect(capitalizeFirstLetter('Hello')).toBe('Hello');
  });

  it('handles single character', () => {
    expect(capitalizeFirstLetter('a')).toBe('A');
  });

  it('handles empty string', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });
});
