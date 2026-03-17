import { describe, expect, test } from 'vitest';
import { atbash } from '../atbash';

describe('atbash', () => {
  test('basic', () => {
    expect(atbash('ABC')).toBe('ZYX');
  });
  test('full alphabet', () => {
    expect(atbash('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe('ZYXWVUTSRQPONMLKJIHGFEDCBA');
  });
  test('lowercase', () => {
    expect(atbash('abc')).toBe('zyx');
  });
  test('preserves non-alpha', () => {
    expect(atbash('Hello, World!')).toBe('Svool, Dliow!');
  });
  test('self-inverse', () => {
    expect(atbash(atbash('Hello'))).toBe('Hello');
  });
  test('empty', () => {
    expect(atbash('')).toBe('');
  });
  test('numbers preserved', () => {
    expect(atbash('ABC123')).toBe('ZYX123');
  });
});
