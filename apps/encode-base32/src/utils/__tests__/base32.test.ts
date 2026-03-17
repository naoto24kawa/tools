import { describe, expect, test } from 'bun:test';
import { decodeBase32, encodeBase32 } from '../base32';

describe('base32', () => {
  test('encodes hello', () => {
    expect(encodeBase32('hello')).toBe('NBSWY3DP');
  });
  test('encodes empty', () => {
    expect(encodeBase32('')).toBe('');
  });
  test('decodes NBSWY3DP', () => {
    expect(decodeBase32('NBSWY3DP')).toBe('hello');
  });
  test('decodes empty', () => {
    expect(decodeBase32('')).toBe('');
  });
  test('round-trip ASCII', () => {
    expect(decodeBase32(encodeBase32('Hello World!'))).toBe('Hello World!');
  });
  test('round-trip longer text', () => {
    const text = 'The quick brown fox jumps over the lazy dog';
    expect(decodeBase32(encodeBase32(text))).toBe(text);
  });
  test('case insensitive decode', () => {
    expect(decodeBase32('nbswy3dp')).toBe('hello');
  });
  test('throws on invalid char', () => {
    expect(() => decodeBase32('1!!!!')).toThrow();
  });
});
