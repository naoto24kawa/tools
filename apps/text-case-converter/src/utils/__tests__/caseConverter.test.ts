import { describe, expect, test } from 'bun:test';
import {
  convertCase,
  toCapitalizeWords,
  toLowerCase,
  toSentenceCase,
  toTitleCase,
  toToggleCase,
  toUpperCase,
} from '../caseConverter';

describe('caseConverter', () => {
  describe('toUpperCase', () => {
    test('converts to uppercase', () => {
      expect(toUpperCase('hello world')).toBe('HELLO WORLD');
    });

    test('handles empty string', () => {
      expect(toUpperCase('')).toBe('');
    });

    test('handles already uppercase', () => {
      expect(toUpperCase('HELLO')).toBe('HELLO');
    });

    test('handles mixed case', () => {
      expect(toUpperCase('HeLLo WoRLd')).toBe('HELLO WORLD');
    });

    test('handles multiline text', () => {
      expect(toUpperCase('hello\nworld')).toBe('HELLO\nWORLD');
    });

    test('preserves Japanese characters', () => {
      expect(toUpperCase('hello こんにちは world')).toBe('HELLO こんにちは WORLD');
    });
  });

  describe('toLowerCase', () => {
    test('converts to lowercase', () => {
      expect(toLowerCase('HELLO WORLD')).toBe('hello world');
    });

    test('handles empty string', () => {
      expect(toLowerCase('')).toBe('');
    });
  });

  describe('toTitleCase', () => {
    test('converts to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
    });

    test('handles single word', () => {
      expect(toTitleCase('hello')).toBe('Hello');
    });

    test('handles already title case', () => {
      expect(toTitleCase('Hello World')).toBe('Hello World');
    });

    test('lowercases rest of word', () => {
      expect(toTitleCase('hELLO wORLD')).toBe('Hello World');
    });

    test('handles hyphenated words', () => {
      expect(toTitleCase('foo-bar')).toBe('Foo-bar');
    });

    test('preserves Japanese characters', () => {
      expect(toTitleCase('hello こんにちは world')).toBe('Hello こんにちは World');
    });
  });

  describe('toSentenceCase', () => {
    test('capitalizes first letter of sentence', () => {
      expect(toSentenceCase('hello world')).toBe('Hello world');
    });

    test('handles multiple sentences with period', () => {
      expect(toSentenceCase('hello world. goodbye world')).toBe('Hello world. Goodbye world');
    });

    test('handles exclamation mark separator', () => {
      expect(toSentenceCase('hello! how are you')).toBe('Hello! How are you');
    });

    test('handles question mark separator', () => {
      expect(toSentenceCase('hello? how are you')).toBe('Hello? How are you');
    });

    test('handles leading whitespace', () => {
      expect(toSentenceCase('  hello world')).toBe('  Hello world');
    });

    test('handles empty string', () => {
      expect(toSentenceCase('')).toBe('');
    });

    test('handles multiline text', () => {
      expect(toSentenceCase('hello world.\ngoodbye world')).toBe('Hello world.\nGoodbye world');
    });
  });

  describe('toToggleCase', () => {
    test('toggles case', () => {
      expect(toToggleCase('Hello World')).toBe('hELLO wORLD');
    });

    test('handles all lowercase', () => {
      expect(toToggleCase('hello')).toBe('HELLO');
    });

    test('handles all uppercase', () => {
      expect(toToggleCase('HELLO')).toBe('hello');
    });

    test('preserves numbers and symbols', () => {
      expect(toToggleCase('Hello 123!')).toBe('hELLO 123!');
    });
  });

  describe('toCapitalizeWords', () => {
    test('capitalizes first letter of each word', () => {
      expect(toCapitalizeWords('hello world')).toBe('Hello World');
    });

    test('preserves existing uppercase in rest of word', () => {
      expect(toCapitalizeWords('hELLO wORLD')).toBe('HELLO WORLD');
    });

    test('handles hyphenated words', () => {
      expect(toCapitalizeWords('foo-bar')).toBe('Foo-Bar');
    });

    test('handles empty string', () => {
      expect(toCapitalizeWords('')).toBe('');
    });
  });

  describe('convertCase', () => {
    test('dispatches to upper', () => {
      expect(convertCase('Hello World', 'upper')).toBe('HELLO WORLD');
    });

    test('dispatches to lower', () => {
      expect(convertCase('Hello World', 'lower')).toBe('hello world');
    });

    test('dispatches to title', () => {
      expect(convertCase('hELLO wORLD', 'title')).toBe('Hello World');
    });

    test('dispatches to sentence', () => {
      expect(convertCase('hello world. goodbye', 'sentence')).toBe('Hello world. Goodbye');
    });

    test('dispatches to toggle (distinct from upper)', () => {
      expect(convertCase('Hello World', 'toggle')).toBe('hELLO wORLD');
    });

    test('dispatches to capitalize (preserves rest unlike title)', () => {
      expect(convertCase('hELLO wORLD', 'capitalize')).toBe('HELLO WORLD');
    });
  });
});
