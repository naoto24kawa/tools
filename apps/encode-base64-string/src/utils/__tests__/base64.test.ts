import { describe, expect, test } from 'bun:test';
import { decodeBase64, encodeBase64 } from '../base64';

describe('base64', () => {
  describe('encodeBase64', () => {
    test('encodes ASCII text', () => {
      expect(encodeBase64('hello')).toBe('aGVsbG8=');
    });

    test('encodes empty string', () => {
      expect(encodeBase64('')).toBe('');
    });

    test('encodes UTF-8 text', () => {
      const encoded = encodeBase64('こんにちは');
      expect(encoded.length).toBeGreaterThan(0);
    });

    test('encodes text with special chars', () => {
      expect(encodeBase64('hello world!')).toBe('aGVsbG8gd29ybGQh');
    });
  });

  describe('decodeBase64', () => {
    test('decodes ASCII text', () => {
      expect(decodeBase64('aGVsbG8=')).toBe('hello');
    });

    test('decodes empty string', () => {
      expect(decodeBase64('')).toBe('');
    });

    test('throws on invalid input', () => {
      expect(() => decodeBase64('!!!invalid!!!')).toThrow();
    });
  });

  describe('round-trip', () => {
    test('ASCII round-trip', () => {
      const original = 'Hello, World!';
      expect(decodeBase64(encodeBase64(original))).toBe(original);
    });

    test('UTF-8 round-trip', () => {
      const original = 'こんにちは世界';
      expect(decodeBase64(encodeBase64(original))).toBe(original);
    });

    test('emoji round-trip', () => {
      const original = 'Hello 🎉 World';
      expect(decodeBase64(encodeBase64(original))).toBe(original);
    });

    test('multiline round-trip', () => {
      const original = 'line1\nline2\nline3';
      expect(decodeBase64(encodeBase64(original))).toBe(original);
    });
  });
});
