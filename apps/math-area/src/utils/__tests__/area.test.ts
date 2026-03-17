import { describe, expect, test } from 'vitest';
import { calculateArea } from '../area';

describe('calculateArea', () => {
  test('circle', () => {
    expect(calculateArea('circle', { radius: 5 })).toBeCloseTo(78.54, 1);
  });
  test('rectangle', () => {
    expect(calculateArea('rectangle', { width: 4, height: 6 })).toBe(24);
  });
  test('triangle', () => {
    expect(calculateArea('triangle', { base: 10, height: 5 })).toBe(25);
  });
  test('trapezoid', () => {
    expect(calculateArea('trapezoid', { topBase: 3, bottomBase: 5, height: 4 })).toBe(16);
  });
  test('ellipse', () => {
    expect(calculateArea('ellipse', { semiMajor: 5, semiMinor: 3 })).toBeCloseTo(47.12, 1);
  });
  test('square', () => {
    expect(calculateArea('square', { side: 7 })).toBe(49);
  });
  test('zero params', () => {
    expect(calculateArea('circle', {})).toBe(0);
  });
});
