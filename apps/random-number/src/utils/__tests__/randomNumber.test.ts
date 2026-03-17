import { describe, expect, test } from 'vitest';
import { DEFAULT_OPTIONS, generateRandomNumbers } from '../randomNumber';

describe('generateRandomNumbers', () => {
  test('generates correct count', () => {
    expect(generateRandomNumbers({ ...DEFAULT_OPTIONS, count: 5 }).length).toBe(5);
  });

  test('values within range', () => {
    const nums = generateRandomNumbers({ ...DEFAULT_OPTIONS, min: 10, max: 20, count: 50 });
    for (const n of nums) {
      expect(n).toBeGreaterThanOrEqual(10);
      expect(n).toBeLessThanOrEqual(20);
    }
  });

  test('no duplicates when disabled', () => {
    const nums = generateRandomNumbers({
      ...DEFAULT_OPTIONS,
      min: 1,
      max: 10,
      count: 10,
      allowDuplicates: false,
    });
    expect(new Set(nums).size).toBe(10);
  });

  test('returns empty when impossible (no dups, count > range)', () => {
    expect(
      generateRandomNumbers({
        ...DEFAULT_OPTIONS,
        min: 1,
        max: 3,
        count: 5,
        allowDuplicates: false,
      })
    ).toEqual([]);
  });

  test('returns empty when min > max', () => {
    expect(generateRandomNumbers({ ...DEFAULT_OPTIONS, min: 10, max: 5 })).toEqual([]);
  });

  test('float values', () => {
    const nums = generateRandomNumbers({
      ...DEFAULT_OPTIONS,
      isFloat: true,
      min: 0,
      max: 1,
      count: 10,
    });
    for (const n of nums) {
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(1);
    }
  });

  test('single number', () => {
    const nums = generateRandomNumbers({ ...DEFAULT_OPTIONS, count: 1 });
    expect(nums.length).toBe(1);
  });
});
