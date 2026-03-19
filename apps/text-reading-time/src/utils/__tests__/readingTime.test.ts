import { describe, expect, it } from 'vitest';
import { countChars, countWords, detectLanguage, estimate } from '../readingTime';

describe('detectLanguage', () => {
  it('detects Japanese text', () => {
    expect(detectLanguage('こんにちは世界')).toBe('ja');
  });

  it('detects English text', () => {
    expect(detectLanguage('Hello world this is a test')).toBe('en');
  });

  it('detects mixed text', () => {
    expect(detectLanguage('Hello world こんにちは this is mixed text')).toBe('mixed');
  });

  it('returns en for empty text', () => {
    expect(detectLanguage('')).toBe('en');
  });
});

describe('countWords', () => {
  it('counts words in English text', () => {
    expect(countWords('Hello world')).toBe(2);
  });

  it('returns 0 for empty text', () => {
    expect(countWords('')).toBe(0);
  });

  it('handles multiple spaces', () => {
    expect(countWords('  Hello   world  ')).toBe(2);
  });
});

describe('countChars', () => {
  it('counts characters excluding whitespace', () => {
    expect(countChars('Hello world')).toBe(10);
  });

  it('returns 0 for empty text', () => {
    expect(countChars('')).toBe(0);
  });

  it('counts Japanese characters', () => {
    expect(countChars('こんにちは')).toBe(5);
  });
});

describe('estimate', () => {
  it('estimates reading time for Japanese text', () => {
    // 500 chars at 500 chars/min = 1 minute
    const text = 'あ'.repeat(500);
    const result = estimate(text);
    expect(result.language).toBe('ja');
    expect(result.charCount).toBe(500);
    expect(result.readingTimeMinutes).toBe(1);
    expect(result.readingTimeSeconds).toBe(0);
  });

  it('estimates reading time for English text', () => {
    // 225 words at 225 words/min = 1 minute
    const words = Array(225).fill('word').join(' ');
    const result = estimate(words);
    expect(result.language).toBe('en');
    expect(result.wordCount).toBe(225);
    expect(result.readingTimeMinutes).toBe(1);
    expect(result.readingTimeSeconds).toBe(0);
  });

  it('returns zero times for empty text', () => {
    const result = estimate('');
    expect(result.charCount).toBe(0);
    expect(result.wordCount).toBe(0);
    expect(result.readingTimeMinutes).toBe(0);
    expect(result.readingTimeSeconds).toBe(0);
  });

  it('estimates speaking time', () => {
    const text = 'あ'.repeat(350);
    const result = estimate(text);
    expect(result.speakingTimeMinutes).toBe(1);
    expect(result.speakingTimeSeconds).toBe(0);
  });
});
