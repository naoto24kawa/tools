import { describe, expect, test } from 'vitest';
import { convertBase } from '../baseConverter';

describe('convertBase', () => {
  test('decimal to hex', () => {
    expect(convertBase('255', 10, 16)).toBe('ff');
  });

  test('hex to decimal', () => {
    expect(convertBase('ff', 16, 10)).toBe('255');
  });

  test('decimal to binary', () => {
    expect(convertBase('10', 10, 2)).toBe('1010');
  });

  test('binary to decimal', () => {
    expect(convertBase('1010', 2, 10)).toBe('10');
  });

  test('decimal to octal', () => {
    expect(convertBase('8', 10, 8)).toBe('10');
  });

  test('octal to decimal', () => {
    expect(convertBase('10', 8, 10)).toBe('8');
  });

  test('hex to binary', () => {
    expect(convertBase('f', 16, 2)).toBe('1111');
  });

  test('zero', () => {
    expect(convertBase('0', 10, 16)).toBe('0');
  });

  test('empty string', () => {
    expect(convertBase('', 10, 16)).toBe('');
  });

  test('large number', () => {
    expect(convertBase('1000000000000', 10, 16)).toBe('e8d4a51000');
  });

  test('negative number', () => {
    expect(convertBase('-10', 10, 2)).toBe('-1010');
  });

  test('case insensitive hex input', () => {
    expect(convertBase('FF', 16, 10)).toBe('255');
  });

  test('base36', () => {
    expect(convertBase('zz', 36, 10)).toBe('1295');
  });

  test('throws on invalid digit', () => {
    expect(() => convertBase('g', 16, 10)).toThrow();
  });

  test('round-trip decimal -> hex -> decimal', () => {
    expect(convertBase(convertBase('12345', 10, 16), 16, 10)).toBe('12345');
  });
});
