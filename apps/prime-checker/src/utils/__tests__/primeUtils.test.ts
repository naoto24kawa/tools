import { describe, it, expect } from 'vitest';
import { isPrime, factorize, formatFactorization, sieve, sieveRange, nthPrime } from '../primeUtils';

describe('primeUtils', () => {
  describe('isPrime', () => {
    it('returns false for 0 and 1', () => {
      expect(isPrime(0)).toBe(false);
      expect(isPrime(1)).toBe(false);
    });

    it('returns true for 2', () => {
      expect(isPrime(2)).toBe(true);
    });

    it('returns true for 3', () => {
      expect(isPrime(3)).toBe(true);
    });

    it('returns false for 4', () => {
      expect(isPrime(4)).toBe(false);
    });

    it('returns true for known primes', () => {
      expect(isPrime(5)).toBe(true);
      expect(isPrime(7)).toBe(true);
      expect(isPrime(11)).toBe(true);
      expect(isPrime(13)).toBe(true);
      expect(isPrime(97)).toBe(true);
      expect(isPrime(101)).toBe(true);
    });

    it('returns false for known composites', () => {
      expect(isPrime(6)).toBe(false);
      expect(isPrime(15)).toBe(false);
      expect(isPrime(100)).toBe(false);
    });

    it('returns false for negative numbers', () => {
      expect(isPrime(-7)).toBe(false);
    });

    it('returns false for non-integers', () => {
      expect(isPrime(3.5)).toBe(false);
    });
  });

  describe('factorize', () => {
    it('factorizes 12 = 2^2 * 3', () => {
      expect(factorize(12)).toEqual([
        { factor: 2, exponent: 2 },
        { factor: 3, exponent: 1 },
      ]);
    });

    it('factorizes a prime number', () => {
      expect(factorize(13)).toEqual([{ factor: 13, exponent: 1 }]);
    });

    it('factorizes 100 = 2^2 * 5^2', () => {
      expect(factorize(100)).toEqual([
        { factor: 2, exponent: 2 },
        { factor: 5, exponent: 2 },
      ]);
    });

    it('factorizes 2 = 2', () => {
      expect(factorize(2)).toEqual([{ factor: 2, exponent: 1 }]);
    });

    it('throws for n < 2', () => {
      expect(() => factorize(1)).toThrow();
      expect(() => factorize(0)).toThrow();
    });
  });

  describe('formatFactorization', () => {
    it('formats single factor', () => {
      expect(formatFactorization([{ factor: 7, exponent: 1 }])).toBe('7');
    });

    it('formats multiple factors', () => {
      expect(
        formatFactorization([
          { factor: 2, exponent: 2 },
          { factor: 3, exponent: 1 },
        ])
      ).toBe('2^2 * 3');
    });
  });

  describe('sieve', () => {
    it('returns empty for limit < 2', () => {
      expect(sieve(1)).toEqual([]);
    });

    it('returns primes up to 10', () => {
      expect(sieve(10)).toEqual([2, 3, 5, 7]);
    });

    it('returns primes up to 30', () => {
      expect(sieve(30)).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
    });

    it('returns [2] for limit = 2', () => {
      expect(sieve(2)).toEqual([2]);
    });
  });

  describe('sieveRange', () => {
    it('returns primes in range', () => {
      expect(sieveRange(10, 30)).toEqual([11, 13, 17, 19, 23, 29]);
    });

    it('returns empty for invalid range', () => {
      expect(sieveRange(30, 10)).toEqual([]);
    });
  });

  describe('nthPrime', () => {
    it('1st prime is 2', () => {
      expect(nthPrime(1)).toBe(2);
    });

    it('2nd prime is 3', () => {
      expect(nthPrime(2)).toBe(3);
    });

    it('10th prime is 29', () => {
      expect(nthPrime(10)).toBe(29);
    });

    it('25th prime is 97', () => {
      expect(nthPrime(25)).toBe(97);
    });

    it('100th prime is 541', () => {
      expect(nthPrime(100)).toBe(541);
    });

    it('throws for n < 1', () => {
      expect(() => nthPrime(0)).toThrow();
    });
  });
});
