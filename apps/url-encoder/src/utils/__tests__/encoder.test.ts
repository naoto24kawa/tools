import { describe, test, expect } from 'bun:test';

/**
 * URL encoding/decoding utility functions
 */

export function encodeURL(text: string): string {
  return encodeURIComponent(text);
}

export function decodeURL(text: string): string {
  return decodeURIComponent(text);
}

export function isValidEncodedURL(text: string): boolean {
  try {
    decodeURIComponent(text);
    return true;
  } catch {
    return false;
  }
}

describe('URL Encoder Utils', () => {
  describe('encodeURL', () => {
    test('should encode simple text', () => {
      expect(encodeURL('hello world')).toBe('hello%20world');
    });

    test('should encode special characters', () => {
      expect(encodeURL('hello&world')).toBe('hello%26world');
      expect(encodeURL('test?query=value')).toContain('%3F');
    });

    test('should encode Japanese characters', () => {
      const result = encodeURL('こんにちは');
      expect(result).toContain('%');
      expect(result.length).toBeGreaterThan(5);
    });

    test('should handle empty string', () => {
      expect(encodeURL('')).toBe('');
    });
  });

  describe('decodeURL', () => {
    test('should decode encoded text', () => {
      expect(decodeURL('hello%20world')).toBe('hello world');
    });

    test('should decode special characters', () => {
      expect(decodeURL('hello%26world')).toBe('hello&world');
    });

    test('should decode Japanese characters', () => {
      const encoded = encodeURL('こんにちは');
      expect(decodeURL(encoded)).toBe('こんにちは');
    });

    test('should handle empty string', () => {
      expect(decodeURL('')).toBe('');
    });
  });

  describe('isValidEncodedURL', () => {
    test('should return true for valid encoded URL', () => {
      expect(isValidEncodedURL('hello%20world')).toBe(true);
      expect(isValidEncodedURL('test')).toBe(true);
    });

    test('should return false for invalid encoded URL', () => {
      expect(isValidEncodedURL('%')).toBe(false);
      expect(isValidEncodedURL('%E')).toBe(false);
    });
  });

  describe('Round-trip encoding', () => {
    test('should preserve text after encode and decode', () => {
      const original = 'Hello World! こんにちは 123';
      const encoded = encodeURL(original);
      const decoded = decodeURL(encoded);
      expect(decoded).toBe(original);
    });
  });
});
