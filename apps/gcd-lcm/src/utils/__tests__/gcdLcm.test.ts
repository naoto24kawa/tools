import { describe, it, expect } from 'vitest';
import { gcd, lcm, gcdMultiple, lcmMultiple, gcdSteps, parseNumbers } from '../gcdLcm';

describe('gcd', () => {
  it('computes gcd of two numbers', () => {
    expect(gcd(12, 8)).toBe(4);
    expect(gcd(54, 24)).toBe(6);
    expect(gcd(7, 13)).toBe(1);
    expect(gcd(0, 5)).toBe(5);
    expect(gcd(5, 0)).toBe(5);
  });

  it('handles negative numbers', () => {
    expect(gcd(-12, 8)).toBe(4);
    expect(gcd(12, -8)).toBe(4);
  });
});

describe('lcm', () => {
  it('computes lcm of two numbers', () => {
    expect(lcm(4, 6)).toBe(12);
    expect(lcm(3, 7)).toBe(21);
    expect(lcm(12, 18)).toBe(36);
  });

  it('returns 0 when either is 0', () => {
    expect(lcm(0, 5)).toBe(0);
    expect(lcm(5, 0)).toBe(0);
  });
});

describe('gcdMultiple', () => {
  it('computes gcd of multiple numbers', () => {
    expect(gcdMultiple([12, 8, 4])).toBe(4);
    expect(gcdMultiple([100, 75, 50])).toBe(25);
  });

  it('throws for empty array', () => {
    expect(() => gcdMultiple([])).toThrow();
  });
});

describe('lcmMultiple', () => {
  it('computes lcm of multiple numbers', () => {
    expect(lcmMultiple([2, 3, 4])).toBe(12);
    expect(lcmMultiple([4, 6, 8])).toBe(24);
  });
});

describe('gcdSteps', () => {
  it('returns steps for Euclidean algorithm', () => {
    const steps = gcdSteps(54, 24);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0]).toEqual({ a: 54, b: 24, quotient: 2, remainder: 6 });
  });
});

describe('parseNumbers', () => {
  it('parses comma-separated numbers', () => {
    expect(parseNumbers('12, 8, 4')).toEqual([12, 8, 4]);
    expect(parseNumbers('100 75 50')).toEqual([100, 75, 50]);
  });

  it('throws for invalid input', () => {
    expect(() => parseNumbers('abc')).toThrow();
    expect(() => parseNumbers('5')).toThrow();
  });
});
