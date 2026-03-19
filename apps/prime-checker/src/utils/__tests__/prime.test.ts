import { describe, it, expect } from 'vitest';
import { isPrime, factorize, formatFactorization, sieveOfEratosthenes, nthPrime } from '../prime';

describe('isPrime', () => {
  it('returns false for numbers less than 2', () => {
    expect(isPrime(0)).toBe(false);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(-5)).toBe(false);
  });

  it('identifies prime numbers', () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(3)).toBe(true);
    expect(isPrime(7)).toBe(true);
    expect(isPrime(97)).toBe(true);
  });

  it('identifies composite numbers', () => {
    expect(isPrime(4)).toBe(false);
    expect(isPrime(9)).toBe(false);
    expect(isPrime(100)).toBe(false);
  });
});

describe('factorize', () => {
  it('returns empty for invalid inputs', () => {
    expect(factorize(0)).toEqual([]);
    expect(factorize(1)).toEqual([]);
  });

  it('factorizes correctly', () => {
    expect(factorize(2)).toEqual([2]);
    expect(factorize(12)).toEqual([2, 2, 3]);
    expect(factorize(100)).toEqual([2, 2, 5, 5]);
    expect(factorize(17)).toEqual([17]);
    expect(factorize(60)).toEqual([2, 2, 3, 5]);
  });
});

describe('formatFactorization', () => {
  it('formats with exponents', () => {
    expect(formatFactorization([2, 2, 3])).toBe('2^2 x 3');
    expect(formatFactorization([2, 2, 5, 5])).toBe('2^2 x 5^2');
    expect(formatFactorization([17])).toBe('17');
  });
});

describe('sieveOfEratosthenes', () => {
  it('returns primes up to limit', () => {
    expect(sieveOfEratosthenes(10)).toEqual([2, 3, 5, 7]);
    expect(sieveOfEratosthenes(20)).toEqual([2, 3, 5, 7, 11, 13, 17, 19]);
    expect(sieveOfEratosthenes(1)).toEqual([]);
  });
});

describe('nthPrime', () => {
  it('returns correct nth prime', () => {
    expect(nthPrime(1)).toBe(2);
    expect(nthPrime(2)).toBe(3);
    expect(nthPrime(5)).toBe(11);
    expect(nthPrime(10)).toBe(29);
  });
});
