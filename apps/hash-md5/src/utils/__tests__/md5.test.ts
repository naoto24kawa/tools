import { describe, expect, test } from 'vitest';
import { md5 } from '../md5';

describe('md5', () => {
  test('empty string', async () => {
    expect(await md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });
  test('hello', async () => {
    expect(await md5('hello')).toBe('5d41402abc4b2a76b9719d911017c592');
  });
  test('Hello World', async () => {
    expect(await md5('Hello World')).toBe('b10a8db164e0754105b7a99be72e3fe5');
  });
  test('abc', async () => {
    expect(await md5('abc')).toBe('900150983cd24fb0d6963f7d28e17f72');
  });
  test('returns 32 char hex', async () => {
    expect(await md5('test')).toMatch(/^[0-9a-f]{32}$/);
  });
  test('same input same output', async () => {
    expect(await md5('test')).toBe(await md5('test'));
  });
  test('different input different output', async () => {
    expect(await md5('a')).not.toBe(await md5('b'));
  });
});
