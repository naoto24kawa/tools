import { describe, expect, test } from 'bun:test';
import { formatFileSize } from '../gifExtractor';

describe('gifExtractor', () => {
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
