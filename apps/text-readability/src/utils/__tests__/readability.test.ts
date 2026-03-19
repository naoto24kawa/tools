import { describe, expect, it } from 'vitest';
import { analyze, countSyllables, detectLanguage, getGrade, splitSentences } from '../readability';

describe('countSyllables', () => {
  it('counts single syllable words', () => {
    expect(countSyllables('cat')).toBe(1);
    expect(countSyllables('dog')).toBe(1);
  });

  it('counts multi-syllable words', () => {
    expect(countSyllables('beautiful')).toBe(3);
    expect(countSyllables('computer')).toBe(3);
  });

  it('handles silent e', () => {
    expect(countSyllables('cake')).toBe(1);
    expect(countSyllables('make')).toBe(1);
  });

  it('returns at least 1 for short words', () => {
    expect(countSyllables('a')).toBe(1);
    expect(countSyllables('I')).toBe(1);
  });
});

describe('splitSentences', () => {
  it('splits on periods', () => {
    expect(splitSentences('Hello. World.')).toHaveLength(2);
  });

  it('splits on question marks and exclamation', () => {
    expect(splitSentences('Hello! How are you? Fine.')).toHaveLength(3);
  });

  it('handles Japanese sentence endings', () => {
    const result = splitSentences('これはテストです。もう一つ。');
    expect(result).toHaveLength(2);
  });

  it('returns empty for empty text', () => {
    expect(splitSentences('')).toHaveLength(0);
  });
});

describe('detectLanguage', () => {
  it('detects English', () => {
    expect(detectLanguage('Hello world test')).toBe('en');
  });

  it('detects Japanese', () => {
    expect(detectLanguage('こんにちは世界')).toBe('ja');
  });
});

describe('getGrade', () => {
  it('returns correct grade labels', () => {
    expect(getGrade(95)).toBe('Very Easy (5th grade)');
    expect(getGrade(65)).toBe('Standard (8th-9th grade)');
    expect(getGrade(20)).toBe('Very Difficult (Professional)');
  });
});

describe('analyze', () => {
  it('returns zero values for empty text', () => {
    const result = analyze('');
    expect(result.sentenceCount).toBe(0);
    expect(result.wordCount).toBe(0);
  });

  it('analyzes simple English text', () => {
    const result = analyze('The cat sat on the mat. The dog ran fast.');
    expect(result.sentenceCount).toBe(2);
    expect(result.wordCount).toBe(10);
    expect(result.language).toBe('en');
    expect(result.fleschReadingEase).toBeGreaterThan(0);
  });

  it('analyzes Japanese text', () => {
    const result = analyze('これはテストです。読みやすさを確認します。');
    expect(result.language).toBe('ja');
    expect(result.sentenceCount).toBe(2);
  });

  it('provides tips', () => {
    const result = analyze('Hello world.');
    expect(result.tips.length).toBeGreaterThan(0);
  });
});
