import { describe, expect, test } from 'bun:test';
import { reverseCharacters, reverseLines, reverseText, reverseWords } from '../textReverse';

describe('textReverse', () => {
  describe('reverseCharacters', () => {
    test('reverses simple text', () => {
      expect(reverseCharacters('hello')).toBe('olleh');
    });

    test('handles empty string', () => {
      expect(reverseCharacters('')).toBe('');
    });

    test('handles spaces', () => {
      expect(reverseCharacters('hello world')).toBe('dlrow olleh');
    });

    test('handles emoji (surrogate pairs)', () => {
      expect(reverseCharacters('ab🎉cd')).toBe('dc🎉ba');
    });

    test('handles Japanese', () => {
      expect(reverseCharacters('こんにちは')).toBe('はちにんこ');
    });

    test('handles multiline', () => {
      expect(reverseCharacters('ab\ncd')).toBe('dc\nba');
    });
  });

  describe('reverseWords', () => {
    test('reverses word order', () => {
      expect(reverseWords('hello world foo')).toBe('foo world hello');
    });

    test('handles single word', () => {
      expect(reverseWords('hello')).toBe('hello');
    });

    test('handles empty string', () => {
      expect(reverseWords('')).toBe('');
    });

    test('preserves lines and reverses within each', () => {
      expect(reverseWords('a b\nc d')).toBe('b a\nd c');
    });

    test('preserves multiple spaces', () => {
      expect(reverseWords('a  b  c')).toBe('c  b  a');
    });

    test('preserves leading/trailing spaces', () => {
      expect(reverseWords(' hello world ')).toBe(' world hello ');
    });
  });

  describe('reverseLines', () => {
    test('reverses line order', () => {
      expect(reverseLines('line1\nline2\nline3')).toBe('line3\nline2\nline1');
    });

    test('handles single line', () => {
      expect(reverseLines('hello')).toBe('hello');
    });

    test('handles empty string', () => {
      expect(reverseLines('')).toBe('');
    });
  });

  describe('reverseText dispatcher', () => {
    test('dispatches to characters', () => {
      expect(reverseText('abc', 'characters')).toBe('cba');
    });

    test('dispatches to words', () => {
      expect(reverseText('a b c', 'words')).toBe('c b a');
    });

    test('dispatches to lines', () => {
      expect(reverseText('a\nb\nc', 'lines')).toBe('c\nb\na');
    });
  });
});
