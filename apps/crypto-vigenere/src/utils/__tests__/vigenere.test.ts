import { describe, expect, test } from 'vitest';
import { vigenereDecrypt, vigenereEncrypt } from '../vigenere';

describe('vigenere', () => {
  test('encrypts with key', () => {
    expect(vigenereEncrypt('HELLO', 'KEY')).toBe('RIJVS');
  });
  test('decrypts with key', () => {
    expect(vigenereDecrypt('RIJVS', 'KEY')).toBe('HELLO');
  });
  test('preserves case', () => {
    expect(vigenereEncrypt('Hello', 'KEY')).toBe('Rijvs');
  });
  test('preserves non-alpha', () => {
    expect(vigenereEncrypt('Hello, World!', 'KEY')).toBe('Rijvs, Uyvjn!');
  });
  test('round-trip', () => {
    expect(vigenereDecrypt(vigenereEncrypt('Hello World', 'SECRET'), 'SECRET')).toBe('Hello World');
  });
  test('empty key returns input', () => {
    expect(vigenereEncrypt('Hello', '')).toBe('Hello');
  });
  test('empty text', () => {
    expect(vigenereEncrypt('', 'KEY')).toBe('');
  });
  test('lowercase key works', () => {
    expect(vigenereEncrypt('HELLO', 'key')).toBe('RIJVS');
  });
});
