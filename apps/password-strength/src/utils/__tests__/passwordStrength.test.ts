import { describe, expect, test } from 'vitest';
import {
  calculateEntropy,
  evaluateCriteria,
  evaluateStrength,
  estimateCrackTime,
} from '../passwordStrength';

describe('calculateEntropy', () => {
  test('returns 0 for empty string', () => {
    expect(calculateEntropy('')).toBe(0);
  });

  test('calculates entropy for lowercase only', () => {
    const entropy = calculateEntropy('abcdef');
    // 6 chars * log2(26) = 6 * 4.7 = ~28.2
    expect(entropy).toBeCloseTo(6 * Math.log2(26), 1);
  });

  test('calculates entropy for mixed case', () => {
    const entropy = calculateEntropy('aBcDeF');
    // 6 chars * log2(52) = 6 * 5.7 = ~34.2
    expect(entropy).toBeCloseTo(6 * Math.log2(52), 1);
  });

  test('calculates entropy for all character types', () => {
    const entropy = calculateEntropy('aB1!');
    // 4 chars * log2(95) = 4 * 6.57 = ~26.3
    expect(entropy).toBeCloseTo(4 * Math.log2(95), 1);
  });

  test('longer passwords have more entropy', () => {
    expect(calculateEntropy('abcdefghijklmnop')).toBeGreaterThan(
      calculateEntropy('abcdef')
    );
  });
});

describe('evaluateCriteria', () => {
  test('all false for empty string except length-related', () => {
    const c = evaluateCriteria('');
    expect(c.minLength).toBe(false);
    expect(c.hasUppercase).toBe(false);
    expect(c.hasLowercase).toBe(false);
    expect(c.hasDigits).toBe(false);
    expect(c.hasSymbols).toBe(false);
    expect(c.length).toBe(0);
  });

  test('detects all character types', () => {
    const c = evaluateCriteria('Password1!');
    expect(c.minLength).toBe(true);
    expect(c.hasUppercase).toBe(true);
    expect(c.hasLowercase).toBe(true);
    expect(c.hasDigits).toBe(true);
    expect(c.hasSymbols).toBe(true);
  });

  test('detects missing uppercase', () => {
    const c = evaluateCriteria('password1!');
    expect(c.hasUppercase).toBe(false);
  });

  test('8 char is minimum length', () => {
    expect(evaluateCriteria('1234567').minLength).toBe(false);
    expect(evaluateCriteria('12345678').minLength).toBe(true);
  });
});

describe('evaluateStrength', () => {
  test('very weak for short password', () => {
    const result = evaluateStrength('abc');
    expect(result.level).toBe('very-weak');
    expect(result.score).toBe(0);
  });

  test('strong for long mixed password', () => {
    const result = evaluateStrength('MyStr0ng!Pass');
    expect(result.score).toBeGreaterThanOrEqual(2);
  });

  test('very strong for very long mixed password', () => {
    const result = evaluateStrength('MyV3ryStr0ng!P@ssw0rd!!');
    expect(result.level).toBe('very-strong');
    expect(result.score).toBe(4);
  });

  test('includes suggestions for weak passwords', () => {
    const result = evaluateStrength('abc');
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  test('no suggestions for very strong passwords', () => {
    const result = evaluateStrength('MyV3ryStr0ng!P@ssw0rd!!');
    expect(result.suggestions.length).toBe(0);
  });
});

describe('estimateCrackTime', () => {
  test('instant for zero entropy', () => {
    expect(estimateCrackTime(0)).toBe('Instant');
  });

  test('very short for low entropy', () => {
    const time = estimateCrackTime(10);
    expect(time).toBe('Less than a second');
  });

  test('returns years for high entropy', () => {
    const time = estimateCrackTime(80);
    expect(time).toContain('years');
  });
});
