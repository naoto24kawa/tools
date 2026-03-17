import { describe, expect, test } from 'vitest';
import { calculateStats, parseNumbers } from '../statistics';

describe('parseNumbers', () => {
  test('comma separated', () => {
    expect(parseNumbers('1,2,3')).toEqual([1, 2, 3]);
  });
  test('space separated', () => {
    expect(parseNumbers('1 2 3')).toEqual([1, 2, 3]);
  });
  test('newline separated', () => {
    expect(parseNumbers('1\n2\n3')).toEqual([1, 2, 3]);
  });
  test('mixed separators', () => {
    expect(parseNumbers('1, 2\n3')).toEqual([1, 2, 3]);
  });
  test('ignores non-numbers', () => {
    expect(parseNumbers('1, abc, 3')).toEqual([1, 3]);
  });
  test('empty', () => {
    expect(parseNumbers('')).toEqual([]);
  });
  test('floats', () => {
    expect(parseNumbers('1.5, 2.5')).toEqual([1.5, 2.5]);
  });
});

describe('calculateStats', () => {
  test('basic stats', () => {
    const stats = calculateStats([1, 2, 3, 4, 5]);
    expect(stats?.count).toBe(5);
    expect(stats?.sum).toBe(15);
    expect(stats?.mean).toBe(3);
    expect(stats?.median).toBe(3);
    expect(stats?.min).toBe(1);
    expect(stats?.max).toBe(5);
    expect(stats?.range).toBe(4);
  });

  test('even count median', () => {
    const stats = calculateStats([1, 2, 3, 4]);
    expect(stats?.median).toBe(2.5);
  });

  test('mode', () => {
    const stats = calculateStats([1, 2, 2, 3]);
    expect(stats?.mode).toEqual([2]);
  });

  test('no mode when all unique', () => {
    const stats = calculateStats([1, 2, 3]);
    expect(stats?.mode).toEqual([]);
  });

  test('variance and stdDev', () => {
    const stats = calculateStats([2, 4, 4, 4, 5, 5, 7, 9]);
    expect(stats?.variance).toBeCloseTo(4, 0);
    expect(stats?.stdDev).toBeCloseTo(2, 0);
  });

  test('single number', () => {
    const stats = calculateStats([42]);
    expect(stats?.mean).toBe(42);
    expect(stats?.variance).toBe(0);
  });

  test('empty returns null', () => {
    expect(calculateStats([])).toBeNull();
  });
});
