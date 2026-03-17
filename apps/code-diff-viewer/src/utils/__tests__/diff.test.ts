import { describe, expect, test } from 'vitest';
import { computeDiff, getDiffStats } from '../diff';

describe('diff', () => {
  test('identical text', () => {
    const diff = computeDiff('a\nb', 'a\nb');
    expect(diff.every((d) => d.type === 'same')).toBe(true);
  });

  test('added line', () => {
    const diff = computeDiff('a', 'a\nb');
    const stats = getDiffStats(diff);
    expect(stats.added).toBe(1);
    expect(stats.same).toBe(1);
  });

  test('removed line', () => {
    const diff = computeDiff('a\nb', 'a');
    const stats = getDiffStats(diff);
    expect(stats.removed).toBe(1);
  });

  test('changed line', () => {
    const diff = computeDiff('hello', 'world');
    const stats = getDiffStats(diff);
    expect(stats.added).toBe(1);
    expect(stats.removed).toBe(1);
  });

  test('empty inputs', () => {
    const diff = computeDiff('', '');
    expect(diff.length).toBe(1); // one empty same line
  });

  test('line numbers', () => {
    const diff = computeDiff('a\nb', 'a\nc');
    const same = diff.find((d) => d.type === 'same');
    expect(same?.lineA).toBe(1);
    expect(same?.lineB).toBe(1);
  });
});
