import { describe, it, expect } from 'vitest';
import NETWORK_UTILS from './index';

describe('NETWORK_UTILS.formatGetParams', () => {
  it('formats single param', () => {
    expect(NETWORK_UTILS.formatGetParams({ key: 'value' })).toBe('?key=value');
  });

  it('formats multiple params', () => {
    const result = NETWORK_UTILS.formatGetParams({ a: '1', b: '2' });
    expect(result).toBe('?a=1&b=2');
  });

  it('encodes special characters', () => {
    const result = NETWORK_UTILS.formatGetParams({ q: 'hello world' });
    expect(result).toBe('?q=hello+world');
  });

  it('omits absent optional filters', () => {
    const result = NETWORK_UTILS.formatGetParams({ skip: '0', externalUrl: undefined, externalContent: undefined });
    expect(result).toBe('?skip=0');
  });
});
