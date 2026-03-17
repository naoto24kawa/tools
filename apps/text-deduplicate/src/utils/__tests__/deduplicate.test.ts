import { describe, test, expect } from 'vitest';
import { deduplicateLines, getRemovedLineCount } from '../deduplicate';

describe('deduplicate utils', () => {
  describe('deduplicateLines', () => {
    const defaultSettings = {
      caseSensitive: true,
      trimWhitespace: false,
      keepEmptyLines: false,
    };

    test('should remove duplicate lines', () => {
      const text = 'line1\nline2\nline1\nline3';
      const result = deduplicateLines(text, defaultSettings);
      
      expect(result).toBe('line1\nline2\nline3');
    });

    test('should handle empty text', () => {
      const result = deduplicateLines('', defaultSettings);
      expect(result).toBe('');
    });

    test('should handle case insensitive mode', () => {
      const text = 'Line1\nline1\nLINE1';
      const result = deduplicateLines(text, {
        ...defaultSettings,
        caseSensitive: false,
      });
      
      expect(result).toBe('Line1');
    });

    test('should handle case sensitive mode', () => {
      const text = 'Line1\nline1\nLINE1';
      const result = deduplicateLines(text, {
        ...defaultSettings,
        caseSensitive: true,
      });
      
      expect(result).toBe('Line1\nline1\nLINE1');
    });

    test('should trim whitespace when enabled', () => {
      const text = '  line1  \nline1\n  line1';
      const result = deduplicateLines(text, {
        ...defaultSettings,
        trimWhitespace: true,
      });
      
      expect(result.split('\n').length).toBe(1);
    });

    test('should keep empty lines when enabled', () => {
      const text = 'line1\n\nline2\n\nline3';
      const result = deduplicateLines(text, {
        ...defaultSettings,
        keepEmptyLines: true,
      });
      
      expect(result).toContain('\n\n');
    });

    test('should remove empty lines when disabled', () => {
      const text = 'line1\n\nline2\n\nline3';
      const result = deduplicateLines(text, {
        ...defaultSettings,
        keepEmptyLines: false,
      });
      
      expect(result).toBe('line1\nline2\nline3');
    });

    test('should handle consecutive duplicates', () => {
      const text = 'line1\nline1\nline1\nline2';
      const result = deduplicateLines(text, defaultSettings);
      
      expect(result).toBe('line1\nline2');
    });

    test('should preserve order of first occurrence', () => {
      const text = 'a\nb\nc\nb\na';
      const result = deduplicateLines(text, defaultSettings);
      
      expect(result).toBe('a\nb\nc');
    });
  });

  describe('getRemovedLineCount', () => {
    test('should calculate removed line count', () => {
      const original = 'line1\nline2\nline1\nline3';
      const deduplicated = 'line1\nline2\nline3';
      
      expect(getRemovedLineCount(original, deduplicated)).toBe(1);
    });

    test('should return 0 when no lines removed', () => {
      const text = 'line1\nline2\nline3';
      
      expect(getRemovedLineCount(text, text)).toBe(0);
    });

    test('should handle empty text', () => {
      expect(getRemovedLineCount('', '')).toBe(0);
    });

    test('should handle all lines removed', () => {
      const original = 'line1\nline1\nline1';
      const deduplicated = 'line1';
      
      expect(getRemovedLineCount(original, deduplicated)).toBe(2);
    });
  });
});
