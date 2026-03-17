import { describe, expect, test } from 'vitest';
import { formatBytes } from '../imageCompress';

describe('imageCompress', () => {
  test('formatBytes B', () => {
    expect(formatBytes(500)).toBe('500 B');
  });
  test('formatBytes KB', () => {
    expect(formatBytes(2048)).toBe('2.0 KB');
  });
  test('formatBytes MB', () => {
    expect(formatBytes(2097152)).toBe('2.0 MB');
  });
});
