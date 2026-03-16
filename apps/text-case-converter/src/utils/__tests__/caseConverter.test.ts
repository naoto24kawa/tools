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
  });

  describe('toSentenceCase', () => {
    test('capitalizes first letter of sentence', () => {
      expect(toSentenceCase('hello world')).toBe('Hello world');
    });

    test('handles multiple sentences', () => {
      expect(toSentenceCase('hello world. goodbye world')).toBe('Hello world. Goodbye world');
    });

    test('handles empty string', () => {
      expect(toSentenceCase('')).toBe('');
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
  });

  describe('toCapitalizeWords', () => {
    test('capitalizes first letter of each word', () => {
      expect(toCapitalizeWords('hello world')).toBe('Hello World');
    });

    test('handles empty string', () => {
      expect(toCapitalizeWords('')).toBe('');
    });
  });

  describe('convertCase', () => {
    test('dispatches to correct function', () => {
      const text = 'hello world';
      expect(convertCase(text, 'upper')).toBe('HELLO WORLD');
      expect(convertCase(text, 'lower')).toBe('hello world');
      expect(convertCase(text, 'title')).toBe('Hello World');
      expect(convertCase(text, 'sentence')).toBe('Hello world');
      expect(convertCase(text, 'toggle')).toBe('HELLO WORLD');
      expect(convertCase(text, 'capitalize')).toBe('Hello World');
    });
  });
});
