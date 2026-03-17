import { describe, expect, test } from 'bun:test';
import { crc32 } from '../crc32';

describe('crc32', () => {
  test('empty string', () => {
    expect(crc32('')).toBe('00000000');
  });
  test('hello', () => {
    expect(crc32('hello')).toBe('3610a686');
  });
  test('Hello World', () => {
    expect(crc32('Hello World')).toBe('4a17b156');
  });
  test('returns 8 char hex', () => {
    expect(crc32('test')).toMatch(/^[0-9a-f]{8}$/);
  });
  test('consistent', () => {
    expect(crc32('abc')).toBe(crc32('abc'));
  });
  test('different input different hash', () => {
    expect(crc32('a')).not.toBe(crc32('b'));
  });
});
