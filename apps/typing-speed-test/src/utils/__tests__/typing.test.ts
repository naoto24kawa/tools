import { describe, it, expect } from 'vitest';
import { calculateStats, getCharStatuses, getRandomText, SAMPLE_TEXTS } from '../typing';

describe('calculateStats', () => {
  it('returns zero stats for empty input', () => {
    const stats = calculateStats('hello', '', 1000);
    expect(stats.wpm).toBe(0);
    expect(stats.accuracy).toBe(0);
    expect(stats.totalChars).toBe(0);
  });

  it('calculates perfect accuracy', () => {
    const stats = calculateStats('hello', 'hello', 60000);
    expect(stats.accuracy).toBe(100);
    expect(stats.correctChars).toBe(5);
    expect(stats.incorrectChars).toBe(0);
    expect(stats.wpm).toBe(1);
  });

  it('calculates partial accuracy', () => {
    const stats = calculateStats('hello', 'hxllo', 60000);
    expect(stats.correctChars).toBe(4);
    expect(stats.incorrectChars).toBe(1);
    expect(stats.accuracy).toBe(80);
  });
});

describe('getCharStatuses', () => {
  it('returns all pending for empty typed', () => {
    const statuses = getCharStatuses('abc', '');
    expect(statuses).toEqual(['pending', 'pending', 'pending']);
  });

  it('marks correct and incorrect chars', () => {
    const statuses = getCharStatuses('abc', 'axc');
    expect(statuses).toEqual(['correct', 'incorrect', 'correct']);
  });

  it('marks remaining as pending', () => {
    const statuses = getCharStatuses('abcd', 'ab');
    expect(statuses).toEqual(['correct', 'correct', 'pending', 'pending']);
  });
});

describe('getRandomText', () => {
  it('returns a text from the sample list', () => {
    const text = getRandomText();
    expect(SAMPLE_TEXTS).toContain(text);
  });
});
