import { describe, test, expect } from 'vitest';
import { detectLanguage, analyzeText } from '../textAnalysis';

describe('textAnalysis', () => {
  describe('detectLanguage', () => {
    test('should detect Japanese text', () => {
      expect(detectLanguage('こんにちは')).toBe('ja');
      expect(detectLanguage('日本語のテキスト')).toBe('ja');
      expect(detectLanguage('カタカナ')).toBe('ja');
    });

    test('should detect English text', () => {
      expect(detectLanguage('Hello world')).toBe('en');
      expect(detectLanguage('This is English text')).toBe('en');
    });

    test('should handle empty text', () => {
      expect(detectLanguage('')).toBe('unknown');
      expect(detectLanguage('   ')).toBe('unknown');
    });

    test('should detect mixed text as Japanese', () => {
      expect(detectLanguage('Hello こんにちは')).toBe('ja');
    });
  });

  describe('analyzeText', () => {
    const defaultSettings = {
      language: 'auto' as const,
      includeSpaces: true,
      includeLineBreaks: true,
      includeSymbols: true,
    };

    test('should analyze empty text', () => {
      const result = analyzeText('', defaultSettings);

      expect(result.charsWithSpaces).toBe(0);
      expect(result.charsWithoutSpaces).toBe(0);
      expect(result.words).toBe(0);
      expect(result.lines).toBe(1);
      expect(result.paragraphs).toBe(0);
    });

    test('should count characters with spaces', () => {
      const result = analyzeText('hello world', defaultSettings);

      expect(result.charsWithSpaces).toBe(11);
      expect(result.charsWithoutSpaces).toBe(10);
    });

    test('should count words in English', () => {
      const result = analyzeText('one two three', { ...defaultSettings, language: 'en' });

      expect(result.words).toBe(3);
    });

    test('should count words in Japanese', () => {
      const result = analyzeText('これは テスト です', { ...defaultSettings, language: 'ja' });

      expect(result.words).toBeGreaterThan(0);
    });

    test('should count lines', () => {
      const result = analyzeText('line1\nline2\nline3', defaultSettings);

      expect(result.lines).toBe(3);
    });

    test('should count paragraphs', () => {
      const result = analyzeText('paragraph1\n\nparagraph2\n\nparagraph3', defaultSettings);

      expect(result.paragraphs).toBe(3);
    });

    test('should calculate bytes', () => {
      const result = analyzeText('test', defaultSettings);

      expect(result.bytes).toBeGreaterThan(0);
    });

    test('should calculate reading time', () => {
      const result = analyzeText('This is a test text', { ...defaultSettings, language: 'en' });

      expect(result.readingTimeMinutes).toBeGreaterThanOrEqual(0);
    });

    test('should handle multi-line text', () => {
      const text = 'line1\nline2\nline3\n\nparagraph2';
      const result = analyzeText(text, defaultSettings);

      expect(result.lines).toBe(5);
      expect(result.paragraphs).toBe(2);
    });

    test('should handle Japanese text', () => {
      const result = analyzeText('こんにちは世界', { ...defaultSettings, language: 'ja' });

      expect(result.charsWithSpaces).toBe(7);
      expect(result.words).toBeGreaterThan(0);
    });
  });
});
