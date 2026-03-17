import { describe, expect, test } from 'vitest';
import { getStats, tokenize } from '../morpheme';

describe('morpheme', () => {
  test('tokenizes mixed Japanese text', () => {
    const tokens = tokenize('Hello世界');
    expect(tokens.length).toBe(2);
    expect(tokens[0].type).toBe('latin');
    expect(tokens[1].type).toBe('kanji');
  });

  test('separates hiragana and kanji', () => {
    const tokens = tokenize('東京は');
    expect(tokens.length).toBe(2);
    expect(tokens[0].type).toBe('kanji');
    expect(tokens[1].type).toBe('hiragana');
  });

  test('handles empty input', () => {
    expect(tokenize('')).toEqual([]);
  });

  test('getStats counts types', () => {
    const tokens = tokenize('ABCあいう');
    const stats = getStats(tokens);
    expect(stats.latin).toBe(1);
    expect(stats.hiragana).toBe(1);
  });

  test('handles numbers', () => {
    const tokens = tokenize('123abc');
    expect(tokens[0].type).toBe('number');
    expect(tokens[1].type).toBe('latin');
  });
});
