import { describe, expect, test } from 'vitest';
import { addPercent, percentChange, percentOf, subtractPercent, whatPercent } from '../percentage';

describe('percentage', () => {
  test('whatPercent: 25 of 100 = 25%', () => {
    expect(whatPercent(25, 100)).toBe(25);
  });
  test('whatPercent: 1 of 3 = 33.33%', () => {
    expect(whatPercent(1, 3)).toBeCloseTo(33.33, 1);
  });
  test('whatPercent: divide by zero', () => {
    expect(whatPercent(10, 0)).toBe(0);
  });

  test('percentOf: 50% of 200 = 100', () => {
    expect(percentOf(50, 200)).toBe(100);
  });
  test('percentOf: 10% of 50 = 5', () => {
    expect(percentOf(10, 50)).toBe(5);
  });

  test('percentChange: 100 to 150 = 50%', () => {
    expect(percentChange(100, 150)).toBe(50);
  });
  test('percentChange: 100 to 80 = -20%', () => {
    expect(percentChange(100, 80)).toBe(-20);
  });
  test('percentChange: divide by zero', () => {
    expect(percentChange(0, 100)).toBe(0);
  });

  test('addPercent: 100 + 10% = 110', () => {
    expect(addPercent(100, 10)).toBe(110);
  });
  test('subtractPercent: 100 - 10% = 90', () => {
    expect(subtractPercent(100, 10)).toBe(90);
  });
});
