import { describe, expect, test } from 'bun:test';
import { formatSize } from '../base64File';

describe('base64File', () => {
  test('formatSize bytes', () => {
    expect(formatSize(500)).toBe('500 B');
  });
  test('formatSize KB', () => {
    expect(formatSize(2048)).toBe('2.0 KB');
  });
  test('formatSize MB', () => {
    expect(formatSize(2097152)).toBe('2.0 MB');
  });
});
