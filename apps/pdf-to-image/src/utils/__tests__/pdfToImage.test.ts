import { describe, expect, test } from 'bun:test';
import { DEFAULT_OPTIONS, formatFileSize, IMAGE_FORMATS } from '../pdfToImage';

describe('pdfToImage', () => {
  test('default options valid', () => {
    expect(DEFAULT_OPTIONS.scale).toBeGreaterThan(0);
    expect(DEFAULT_OPTIONS.quality).toBeGreaterThan(0);
  });
  test('formats are png and jpeg', () => {
    expect(IMAGE_FORMATS).toContain('png');
    expect(IMAGE_FORMATS).toContain('jpeg');
  });
  test('formatFileSize', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
  });
});
