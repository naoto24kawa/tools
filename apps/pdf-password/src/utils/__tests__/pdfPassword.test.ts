import { describe, expect, test } from 'vitest';
import { formatFileSize } from '../pdfPassword';

describe('pdfPassword', () => {
  test('formatFileSize bytes', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });
  test('formatFileSize KB', () => {
    expect(formatFileSize(2048)).toBe('2.0 KB');
  });
  test('formatFileSize MB', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB');
  });
});
