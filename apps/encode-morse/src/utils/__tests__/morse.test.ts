import { describe, expect, test } from 'vitest';
import { morseToText, textToMorse } from '../morse';

describe('morse', () => {
  describe('textToMorse', () => {
    test('converts hello', () => {
      expect(textToMorse('HELLO')).toBe('.... . .-.. .-.. ---');
    });

    test('converts with spaces (word separator)', () => {
      expect(textToMorse('HI THERE')).toBe('.... .. / - .... . .-. .');
    });

    test('converts numbers', () => {
      expect(textToMorse('123')).toBe('.---- ..--- ...--');
    });

    test('case insensitive', () => {
      expect(textToMorse('hello')).toBe('.... . .-.. .-.. ---');
    });

    test('handles SOS', () => {
      expect(textToMorse('SOS')).toBe('... --- ...');
    });

    test('empty string', () => {
      expect(textToMorse('')).toBe('');
    });
  });

  describe('morseToText', () => {
    test('decodes hello', () => {
      expect(morseToText('.... . .-.. .-.. ---')).toBe('HELLO');
    });

    test('decodes with word separator', () => {
      expect(morseToText('.... .. / - .... . .-. .')).toBe('HI THERE');
    });

    test('decodes numbers', () => {
      expect(morseToText('.---- ..--- ...--')).toBe('123');
    });

    test('empty string', () => {
      expect(morseToText('')).toBe('');
    });
  });

  describe('round-trip', () => {
    test('text -> morse -> text', () => {
      expect(morseToText(textToMorse('HELLO WORLD'))).toBe('HELLO WORLD');
    });

    test('with numbers and punctuation', () => {
      expect(morseToText(textToMorse('TEST 123'))).toBe('TEST 123');
    });
  });
});
