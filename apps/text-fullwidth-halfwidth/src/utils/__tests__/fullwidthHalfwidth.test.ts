import { describe, expect, test } from 'bun:test';
import { convert, DEFAULT_OPTIONS } from '../fullwidthHalfwidth';

describe('fullwidthHalfwidth', () => {
  describe('toHalfwidth', () => {
    test('converts fullwidth alphanumeric to halfwidth', () => {
      expect(convert('\uFF21\uFF22\uFF23\uFF11\uFF12\uFF13', DEFAULT_OPTIONS)).toBe('ABC123');
    });

    test('converts fullwidth katakana to halfwidth', () => {
      expect(convert('\u30A2\u30A4\u30A6', DEFAULT_OPTIONS)).toBe('\uFF71\uFF72\uFF73');
    });

    test('converts dakuten katakana', () => {
      expect(convert('\u30AC\u30AE', DEFAULT_OPTIONS)).toBe('\uFF76\uFF9E\uFF77\uFF9E');
    });

    test('converts fullwidth space to halfwidth', () => {
      expect(convert('\u3000', DEFAULT_OPTIONS)).toBe(' ');
    });

    test('alphanumeric only', () => {
      const result = convert('\uFF21\u30A2\u3000', {
        ...DEFAULT_OPTIONS,
        katakana: false,
        symbol: false,
      });
      expect(result).toBe('A\u30A2\u3000');
    });

    test('katakana only', () => {
      const result = convert('\uFF21\u30A2\u3000', {
        ...DEFAULT_OPTIONS,
        alphanumeric: false,
        symbol: false,
      });
      expect(result).toBe('\uFF21\uFF71\u3000');
    });
  });

  describe('toFullwidth', () => {
    test('converts halfwidth alphanumeric to fullwidth', () => {
      const opts = { ...DEFAULT_OPTIONS, mode: 'toFullwidth' as const };
      expect(convert('ABC123', opts)).toBe('\uFF21\uFF22\uFF23\uFF11\uFF12\uFF13');
    });

    test('converts halfwidth katakana to fullwidth', () => {
      const opts = { ...DEFAULT_OPTIONS, mode: 'toFullwidth' as const };
      expect(convert('\uFF71\uFF72\uFF73', opts)).toBe('\u30A2\u30A4\u30A6');
    });

    test('converts halfwidth dakuten katakana to fullwidth', () => {
      const opts = { ...DEFAULT_OPTIONS, mode: 'toFullwidth' as const };
      expect(convert('\uFF76\uFF9E', opts)).toBe('\u30AC');
    });

    test('converts halfwidth space to fullwidth', () => {
      const opts = { ...DEFAULT_OPTIONS, mode: 'toFullwidth' as const };
      expect(convert(' ', opts)).toBe('\u3000');
    });
  });

  describe('edge cases', () => {
    test('empty string', () => {
      expect(convert('', DEFAULT_OPTIONS)).toBe('');
    });

    test('text with no conversion targets', () => {
      expect(convert('\u3053\u3093\u306B\u3061\u306F', DEFAULT_OPTIONS)).toBe(
        '\u3053\u3093\u306B\u3061\u306F'
      );
    });

    test('mixed content preserves non-target characters', () => {
      const result = convert('Hello\uFF21\u30A2\u3053\u3093\u306B\u3061\u306F', DEFAULT_OPTIONS);
      expect(result).toContain('Hello');
      expect(result).toContain('A');
      expect(result).toContain('\u3053\u3093\u306B\u3061\u306F');
    });
  });
});
