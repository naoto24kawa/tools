import { describe, expect, test } from 'vitest';
import { generateSHA1 } from '../sha1';

describe('generateSHA1', () => {
  test('hello', async () => {
    expect(await generateSHA1('hello')).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
  });

  test('empty string', async () => {
    expect(await generateSHA1('')).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');
  });

  test('returns 40 char hex', async () => {
    expect(await generateSHA1('test')).toMatch(/^[0-9a-f]{40}$/);
  });

  test('consistent output', async () => {
    const h1 = await generateSHA1('abc');
    const h2 = await generateSHA1('abc');
    expect(h1).toBe(h2);
  });

  test('different input different hash', async () => {
    const h1 = await generateSHA1('a');
    const h2 = await generateSHA1('b');
    expect(h1).not.toBe(h2);
  });
});
