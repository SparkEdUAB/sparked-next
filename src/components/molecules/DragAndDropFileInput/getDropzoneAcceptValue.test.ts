import { describe, it, expect } from 'vitest';
import { getDropzoneAcceptValue } from './getDropzoneAcceptValue';

describe('getDropzoneAcceptValue', () => {
  it('returns image accept value', () => {
    const result = getDropzoneAcceptValue(['image']);
    expect(result['image/*']).toEqual(['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']);
  });

  it('returns video accept value', () => {
    const result = getDropzoneAcceptValue(['video']);
    expect(result['video/*']).toEqual(['.mp4', '.webm', '.ogg']);
  });

  it('returns pdf accept value', () => {
    const result = getDropzoneAcceptValue(['pdf']);
    expect(result['application/pdf']).toEqual(['.pdf']);
  });

  it('returns combined accept values', () => {
    const result = getDropzoneAcceptValue(['image', 'video', 'pdf']);
    expect(Object.keys(result)).toHaveLength(3);
  });

  it('returns empty object for empty array', () => {
    const result = getDropzoneAcceptValue([]);
    expect(result).toEqual({});
  });
});
