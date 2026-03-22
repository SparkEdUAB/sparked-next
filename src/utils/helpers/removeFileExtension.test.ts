import { describe, it, expect } from 'vitest';
import { removeFileExtension } from './removeFileExtension';

describe('removeFileExtension', () => {
  it('removes single extension', () => {
    expect(removeFileExtension('doc.pdf')).toBe('doc');
  });

  it('removes only last extension from double extension', () => {
    expect(removeFileExtension('a.tar.gz')).toBe('a.tar');
  });

  it('returns filename unchanged when no extension', () => {
    expect(removeFileExtension('noext')).toBe('noext');
  });
});
