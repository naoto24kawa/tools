import { describe, expect, test } from 'vitest';
import { rollDice } from '../dice';

describe('dice', () => {
  test('returns correct count of values', () => {
    const result = rollDice(6, 5);
    expect(result.values.length).toBe(5);
  });

  test('values are within range for d6', () => {
    const result = rollDice(6, 100);
    for (const v of result.values) {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(6);
    }
  });

  test('values are within range for d20', () => {
    const result = rollDice(20, 50);
    for (const v of result.values) {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(20);
    }
  });

  test('total is sum of values', () => {
    const result = rollDice(6, 5);
    expect(result.total).toBe(result.values.reduce((a, b) => a + b, 0));
  });

  test('min is minimum value', () => {
    const result = rollDice(6, 10);
    expect(result.min).toBe(Math.min(...result.values));
  });

  test('max is maximum value', () => {
    const result = rollDice(6, 10);
    expect(result.max).toBe(Math.max(...result.values));
  });

  test('average is correct', () => {
    const result = rollDice(6, 4);
    expect(result.average).toBeCloseTo(result.total / 4);
  });

  test('single die', () => {
    const result = rollDice(6, 1);
    expect(result.values.length).toBe(1);
    expect(result.total).toBe(result.values[0]);
  });

  test('d100', () => {
    const result = rollDice(100, 20);
    for (const v of result.values) {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(100);
    }
  });
});
