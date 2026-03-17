import { describe, expect, test } from 'bun:test';
import { analyzePassword } from '../passwordChecker';

describe('analyzePassword', () => {
  test('very weak password', () => {
    const result = analyzePassword('ab');
    expect(result.score).toBeLessThanOrEqual(1);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  test('strong password', () => {
    const result = analyzePassword('Abc123!@#DefGhi456');
    expect(result.score).toBeGreaterThanOrEqual(3);
  });

  test('detects uppercase', () => {
    expect(analyzePassword('ABC').hasUppercase).toBe(true);
    expect(analyzePassword('abc').hasUppercase).toBe(false);
  });

  test('detects lowercase', () => {
    expect(analyzePassword('abc').hasLowercase).toBe(true);
    expect(analyzePassword('ABC').hasLowercase).toBe(false);
  });

  test('detects numbers', () => {
    expect(analyzePassword('abc123').hasNumbers).toBe(true);
    expect(analyzePassword('abc').hasNumbers).toBe(false);
  });

  test('detects symbols', () => {
    expect(analyzePassword('abc!@#').hasSymbols).toBe(true);
    expect(analyzePassword('abc123').hasSymbols).toBe(false);
  });

  test('length is correct', () => {
    expect(analyzePassword('hello').length).toBe(5);
  });

  test('entropy increases with length', () => {
    const short = analyzePassword('abc');
    const long = analyzePassword('abcdefghijklmnop');
    expect(long.entropy).toBeGreaterThan(short.entropy);
  });

  test('suggestions for short password', () => {
    const result = analyzePassword('ab');
    expect(result.suggestions).toContain('8文字以上にしてください');
  });

  test('time to crack is a string', () => {
    const result = analyzePassword('test');
    expect(typeof result.timeToCrack).toBe('string');
  });
});
