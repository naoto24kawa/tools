import { describe, it, expect } from 'vitest';
import {
  generate,
  nthFib,
  isFibonacci,
  goldenRatioApproximations,
  GOLDEN_RATIO,
  fibonacciIndex,
} from '../fibonacci';

describe('fibonacci', () => {
  describe('generate', () => {
    it('generates 0 terms', () => {
      expect(generate(0)).toEqual([]);
    });

    it('generates 1 term', () => {
      expect(generate(1)).toEqual([0]);
    });

    it('generates 2 terms', () => {
      expect(generate(2)).toEqual([0, 1]);
    });

    it('generates 10 terms', () => {
      expect(generate(10)).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
    });
  });

  describe('nthFib', () => {
    it('F(0) = 0', () => {
      expect(nthFib(0)).toBe(0);
    });

    it('F(1) = 1', () => {
      expect(nthFib(1)).toBe(1);
    });

    it('F(10) = 55', () => {
      expect(nthFib(10)).toBe(55);
    });

    it('F(20) = 6765', () => {
      expect(nthFib(20)).toBe(6765);
    });

    it('throws for negative n', () => {
      expect(() => nthFib(-1)).toThrow();
    });

    it('throws for non-integer', () => {
      expect(() => nthFib(3.5)).toThrow();
    });
  });

  describe('isFibonacci', () => {
    it('returns true for Fibonacci numbers', () => {
      expect(isFibonacci(0)).toBe(true);
      expect(isFibonacci(1)).toBe(true);
      expect(isFibonacci(2)).toBe(true);
      expect(isFibonacci(3)).toBe(true);
      expect(isFibonacci(5)).toBe(true);
      expect(isFibonacci(8)).toBe(true);
      expect(isFibonacci(13)).toBe(true);
      expect(isFibonacci(21)).toBe(true);
      expect(isFibonacci(144)).toBe(true);
    });

    it('returns false for non-Fibonacci numbers', () => {
      expect(isFibonacci(4)).toBe(false);
      expect(isFibonacci(6)).toBe(false);
      expect(isFibonacci(7)).toBe(false);
      expect(isFibonacci(9)).toBe(false);
      expect(isFibonacci(10)).toBe(false);
    });

    it('returns false for negative numbers', () => {
      expect(isFibonacci(-1)).toBe(false);
    });
  });

  describe('goldenRatioApproximations', () => {
    it('generates approximations converging to golden ratio', () => {
      const approx = goldenRatioApproximations(20);
      expect(approx.length).toBe(20);
      // Later approximations should be closer to golden ratio
      const lastRatio = approx[approx.length - 1].ratio;
      expect(lastRatio).toBeCloseTo(GOLDEN_RATIO, 5);
    });
  });

  describe('fibonacciIndex', () => {
    it('returns index for Fibonacci numbers', () => {
      expect(fibonacciIndex(0)).toBe(0);
      expect(fibonacciIndex(1)).toBe(1);
      expect(fibonacciIndex(8)).toBe(6);
      expect(fibonacciIndex(144)).toBe(12);
    });

    it('returns null for non-Fibonacci numbers', () => {
      expect(fibonacciIndex(4)).toBeNull();
      expect(fibonacciIndex(7)).toBeNull();
    });
  });

  describe('GOLDEN_RATIO', () => {
    it('equals (1 + sqrt(5)) / 2', () => {
      expect(GOLDEN_RATIO).toBeCloseTo(1.618033988749895);
    });
  });
});
