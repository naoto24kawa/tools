import { describe, expect, test } from 'bun:test';
import { bruteForce, caesarDecrypt, caesarEncrypt } from '../caesar';

describe('caesar', () => {
  test('encrypts with shift 3', () => {
    expect(caesarEncrypt('ABC', 3)).toBe('DEF');
  });

  test('wraps around Z', () => {
    expect(caesarEncrypt('XYZ', 3)).toBe('ABC');
  });

  test('preserves case', () => {
    expect(caesarEncrypt('Hello', 1)).toBe('Ifmmp');
  });

  test('preserves non-alpha characters', () => {
    expect(caesarEncrypt('Hello, World!', 5)).toBe('Mjqqt, Btwqi!');
  });

  test('shift 0 returns same', () => {
    expect(caesarEncrypt('ABC', 0)).toBe('ABC');
  });

  test('shift 26 returns same', () => {
    expect(caesarEncrypt('ABC', 26)).toBe('ABC');
  });

  test('negative shift', () => {
    expect(caesarEncrypt('DEF', -3)).toBe('ABC');
  });

  test('decrypt reverses encrypt', () => {
    expect(caesarDecrypt('DEF', 3)).toBe('ABC');
  });

  test('round-trip', () => {
    const original = 'Hello World 123!';
    expect(caesarDecrypt(caesarEncrypt(original, 13), 13)).toBe(original);
  });

  test('empty string', () => {
    expect(caesarEncrypt('', 5)).toBe('');
  });

  test('bruteForce returns 26 results', () => {
    const results = bruteForce('DEF');
    expect(results.length).toBe(26);
    expect(results[3].result).toBe('ABC');
  });
});
