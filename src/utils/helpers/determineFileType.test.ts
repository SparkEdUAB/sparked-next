import { describe, it, expect } from 'vitest';
import { determineFileType } from './determineFileType';

describe('determineFileType', () => {
  it.each(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'])('returns "image" for .%s', (ext) => {
    expect(determineFileType(`file.${ext}`)).toBe('image');
  });

  it.each(['mp4', 'webm', 'ogg'])('returns "video" for .%s', (ext) => {
    expect(determineFileType(`file.${ext}`)).toBe('video');
  });

  it('returns "pdf" for .pdf', () => {
    expect(determineFileType('document.pdf')).toBe('pdf');
  });

  it('returns null for unknown extension', () => {
    expect(determineFileType('file.xyz')).toBeNull();
  });

  it('returns null for file with no extension', () => {
    expect(determineFileType('noextension')).toBeNull();
  });

  it('handles uppercase by lowercasing', () => {
    expect(determineFileType('photo.JPG')).toBe('image');
  });
});
