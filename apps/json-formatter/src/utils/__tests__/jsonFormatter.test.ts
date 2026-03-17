import { describe, expect, test } from 'bun:test';
import { formatJSON, minifyJSON, validateJSON } from '../jsonFormatter';

describe('jsonFormatter', () => {
  describe('formatJSON', () => {
    test('formats with 2 spaces', () => {
      expect(formatJSON('{"a":1,"b":2}', 2)).toEqual({
        formatted: '{\n  "a": 1,\n  "b": 2\n}',
        error: null,
      });
    });

    test('formats with 4 spaces', () => {
      const result = formatJSON('{"a":1}', 4);
      expect(result.formatted).toContain('    "a"');
      expect(result.error).toBeNull();
    });

    test('returns error for invalid JSON', () => {
      const result = formatJSON('{invalid}', 2);
      expect(result.error).not.toBeNull();
    });

    test('handles empty string', () => {
      expect(formatJSON('', 2)).toEqual({ formatted: '', error: null });
    });

    test('formats arrays', () => {
      const result = formatJSON('[1,2,3]', 2);
      expect(result.formatted).toBe('[\n  1,\n  2,\n  3\n]');
      expect(result.error).toBeNull();
    });

    test('formats nested objects', () => {
      const result = formatJSON('{"a":{"b":1}}', 2);
      expect(result.formatted).toContain('  "a"');
      expect(result.formatted).toContain('    "b"');
    });
  });

  describe('minifyJSON', () => {
    test('minifies formatted JSON', () => {
      const input = '{\n  "a": 1,\n  "b": 2\n}';
      expect(minifyJSON(input)).toEqual({
        formatted: '{"a":1,"b":2}',
        error: null,
      });
    });

    test('returns error for invalid JSON', () => {
      const result = minifyJSON('{invalid}');
      expect(result.error).not.toBeNull();
    });

    test('handles empty string', () => {
      expect(minifyJSON('')).toEqual({ formatted: '', error: null });
    });
  });

  describe('validateJSON', () => {
    test('valid JSON', () => {
      expect(validateJSON('{"a":1}')).toEqual({ valid: true, error: null });
    });

    test('invalid JSON', () => {
      const result = validateJSON('{invalid}');
      expect(result.valid).toBe(false);
      expect(result.error).not.toBeNull();
    });

    test('empty string', () => {
      expect(validateJSON('')).toEqual({ valid: false, error: null });
    });

    test('valid array', () => {
      expect(validateJSON('[1,2,3]')).toEqual({ valid: true, error: null });
    });

    test('valid string', () => {
      expect(validateJSON('"hello"')).toEqual({ valid: true, error: null });
    });
  });
});
