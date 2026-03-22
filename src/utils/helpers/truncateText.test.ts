import { describe, it, expect } from 'vitest';
import { truncateText } from './truncateText';

describe('truncateText', () => {
  it('returns short text unchanged', () => {
    expect(truncateText('hi', 10)).toBe('hi');
  });

  it('returns text at exact length unchanged', () => {
    expect(truncateText('hello', 5)).toBe('hello');
  });

  it('truncates long text with ellipsis', () => {
    expect(truncateText('hello world', 5)).toBe('hello...');
  });

  it('returns empty string for falsy value', () => {
    expect(truncateText('', 10)).toBe('');
  });
});
