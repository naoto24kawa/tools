import { describe, expect, test } from 'vitest';
import { analyzeWordFrequency, DEFAULT_OPTIONS } from '../wordFrequency';

describe('analyzeWordFrequency', () => {
  test('counts word frequencies', () => {
    const items = analyzeWordFrequency('hello world hello', DEFAULT_OPTIONS);
    expect(items[0].word).toBe('hello');
    expect(items[0].count).toBe(2);
    expect(items[1].word).toBe('world');
    expect(items[1].count).toBe(1);
  });

  test('case insensitive by default', () => {
    const items = analyzeWordFrequency('Hello hello HELLO', DEFAULT_OPTIONS);
    expect(items.length).toBe(1);
    expect(items[0].count).toBe(3);
  });

  test('case sensitive option', () => {
    const items = analyzeWordFrequency('Hello hello', { ...DEFAULT_OPTIONS, caseSensitive: true });
    expect(items.length).toBe(2);
  });

  test('sorts by count descending', () => {
    const items = analyzeWordFrequency('a b b c c c', DEFAULT_OPTIONS);
    expect(items[0].word).toBe('c');
    expect(items[1].word).toBe('b');
    expect(items[2].word).toBe('a');
  });

  test('sorts alphabetically', () => {
    const items = analyzeWordFrequency('c b a', { ...DEFAULT_OPTIONS, sortBy: 'alphabetical' });
    expect(items[0].word).toBe('a');
    expect(items[1].word).toBe('b');
    expect(items[2].word).toBe('c');
  });

  test('min length filter', () => {
    const items = analyzeWordFrequency('a bb ccc', { ...DEFAULT_OPTIONS, minLength: 2 });
    expect(items.length).toBe(2);
    expect(items.find((i) => i.word === 'a')).toBeUndefined();
  });

  test('calculates percentage', () => {
    const items = analyzeWordFrequency('a a b', DEFAULT_OPTIONS);
    const aItem = items.find((i) => i.word === 'a');
    expect(aItem?.percentage).toBeCloseTo(66.67, 0);
  });

  test('handles Japanese text', () => {
    const items = analyzeWordFrequency('hello world', DEFAULT_OPTIONS);
    expect(items.length).toBe(2);
  });

  test('handles empty string', () => {
    expect(analyzeWordFrequency('', DEFAULT_OPTIONS)).toEqual([]);
  });

  test('handles only whitespace', () => {
    expect(analyzeWordFrequency('   ', DEFAULT_OPTIONS)).toEqual([]);
  });

  test('handles multiline', () => {
    const items = analyzeWordFrequency('hello\nworld\nhello', DEFAULT_OPTIONS);
    expect(items[0].word).toBe('hello');
    expect(items[0].count).toBe(2);
  });
});
