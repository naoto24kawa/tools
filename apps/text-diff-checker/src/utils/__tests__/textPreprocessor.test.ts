import { describe, test, expect } from 'bun:test';
import { preprocessText } from '../textPreprocessor';

describe('textPreprocessor', () => {
  describe('preprocessText', () => {
    test('should return text as-is with no options', () => {
      const text = '  line1  \n  line2  ';
      const options = {
        ignoreWhitespace: false,
        ignoreEmptyLines: false,
        ignoreAllWhitespace: false,
      };
      
      const result = preprocessText(text, options);
      expect(result).toBe(text);
    });

    test('should trim whitespace when ignoreWhitespace is true', () => {
      const text = '  line1  \n  line2  ';
      const options = {
        ignoreWhitespace: true,
        ignoreEmptyLines: false,
        ignoreAllWhitespace: false,
      };
      
      const result = preprocessText(text, options);
      expect(result).toBe('line1\nline2');
    });

    test('should remove all whitespace when ignoreAllWhitespace is true', () => {
      const text = '  l i n e 1  \n  l i n e 2  ';
      const options = {
        ignoreWhitespace: false,
        ignoreEmptyLines: false,
        ignoreAllWhitespace: true,
      };
      
      const result = preprocessText(text, options);
      expect(result).toBe('line1\nline2');
    });

    test('should remove empty lines when ignoreEmptyLines is true', () => {
      const text = 'line1\n\nline2\n\nline3';
      const options = {
        ignoreWhitespace: false,
        ignoreEmptyLines: true,
        ignoreAllWhitespace: false,
      };
      
      const result = preprocessText(text, options);
      expect(result).toBe('line1\nline2\nline3');
    });

    test('should handle multiple options together', () => {
      const text = '  line1  \n\n  line2  \n\n  line3  ';
      const options = {
        ignoreWhitespace: true,
        ignoreEmptyLines: true,
        ignoreAllWhitespace: false,
      };
      
      const result = preprocessText(text, options);
      expect(result).toBe('line1\nline2\nline3');
    });

    test('should handle empty text', () => {
      const options = {
        ignoreWhitespace: true,
        ignoreEmptyLines: true,
        ignoreAllWhitespace: false,
      };
      
      const result = preprocessText('', options);
      expect(result).toBe('');
    });

    test('should preserve line breaks', () => {
      const text = 'line1\nline2\nline3';
      const options = {
        ignoreWhitespace: false,
        ignoreEmptyLines: false,
        ignoreAllWhitespace: false,
      };
      
      const result = preprocessText(text, options);
      expect(result.split('\n').length).toBe(3);
    });

    test('should handle only whitespace lines', () => {
      const text = 'line1\n   \nline2';
      const options = {
        ignoreWhitespace: false,
        ignoreEmptyLines: true,
        ignoreAllWhitespace: false,
      };
      
      const result = preprocessText(text, options);
      expect(result).toBe('line1\nline2');
    });
  });
});
