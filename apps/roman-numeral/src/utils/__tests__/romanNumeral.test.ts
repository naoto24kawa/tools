import { describe, it, expect } from 'vitest';
import { toRoman, toArabic, isValidRoman, isValidArabic } from '../romanNumeral';

describe('toRoman', () => {
  it('converts basic numbers', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(9)).toBe('IX');
    expect(toRoman(14)).toBe('XIV');
    expect(toRoman(42)).toBe('XLII');
    expect(toRoman(99)).toBe('XCIX');
    expect(toRoman(399)).toBe('CCCXCIX');
    expect(toRoman(944)).toBe('CMXLIV');
    expect(toRoman(1994)).toBe('MCMXCIV');
    expect(toRoman(3999)).toBe('MMMCMXCIX');
  });

  it('throws for out of range', () => {
    expect(() => toRoman(0)).toThrow();
    expect(() => toRoman(-1)).toThrow();
    expect(() => toRoman(4000)).toThrow();
    expect(() => toRoman(1.5)).toThrow();
  });
});

describe('toArabic', () => {
  it('converts valid roman numerals', () => {
    expect(toArabic('I')).toBe(1);
    expect(toArabic('IV')).toBe(4);
    expect(toArabic('IX')).toBe(9);
    expect(toArabic('XLII')).toBe(42);
    expect(toArabic('XCIX')).toBe(99);
    expect(toArabic('MCMXCIV')).toBe(1994);
    expect(toArabic('MMMCMXCIX')).toBe(3999);
  });

  it('handles lowercase input', () => {
    expect(toArabic('iv')).toBe(4);
    expect(toArabic('mcmxciv')).toBe(1994);
  });

  it('throws for invalid input', () => {
    expect(() => toArabic('')).toThrow();
    expect(() => toArabic('IIII')).toThrow();
    expect(() => toArabic('VV')).toThrow();
    expect(() => toArabic('ABC')).toThrow();
  });
});

describe('isValidRoman', () => {
  it('validates correct roman numerals', () => {
    expect(isValidRoman('I')).toBe(true);
    expect(isValidRoman('MCMXCIV')).toBe(true);
  });

  it('rejects invalid roman numerals', () => {
    expect(isValidRoman('')).toBe(false);
    expect(isValidRoman('IIII')).toBe(false);
    expect(isValidRoman('ABC')).toBe(false);
  });
});

describe('isValidArabic', () => {
  it('validates range 1-3999', () => {
    expect(isValidArabic(1)).toBe(true);
    expect(isValidArabic(3999)).toBe(true);
    expect(isValidArabic(0)).toBe(false);
    expect(isValidArabic(4000)).toBe(false);
    expect(isValidArabic(1.5)).toBe(false);
  });
});
