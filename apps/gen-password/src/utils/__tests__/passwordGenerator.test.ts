import { describe, expect, test } from 'bun:test';
import {
  DEFAULT_OPTIONS,
  estimateStrength,
  generatePassword,
  generatePasswords,
} from '../passwordGenerator';

describe('passwordGenerator', () => {
  test('generates password of specified length', () => {
    const pw = generatePassword({ ...DEFAULT_OPTIONS, length: 20 });
    expect(pw.length).toBe(20);
  });

  test('generates uppercase only', () => {
    const pw = generatePassword({
      ...DEFAULT_OPTIONS,
      lowercase: false,
      numbers: false,
      symbols: false,
    });
    expect(pw).toMatch(/^[A-Z]+$/);
  });

  test('generates lowercase only', () => {
    const pw = generatePassword({
      ...DEFAULT_OPTIONS,
      uppercase: false,
      numbers: false,
      symbols: false,
    });
    expect(pw).toMatch(/^[a-z]+$/);
  });

  test('generates numbers only', () => {
    const pw = generatePassword({
      ...DEFAULT_OPTIONS,
      uppercase: false,
      lowercase: false,
      symbols: false,
    });
    expect(pw).toMatch(/^[0-9]+$/);
  });

  test('excludes characters', () => {
    const pw = generatePassword({
      ...DEFAULT_OPTIONS,
      excludeChars: 'abcABC123',
      length: 100,
    });
    expect(pw).not.toContain('a');
    expect(pw).not.toContain('A');
    expect(pw).not.toContain('1');
  });

  test('returns empty string with no char types', () => {
    const pw = generatePassword({
      ...DEFAULT_OPTIONS,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
    });
    expect(pw).toBe('');
  });

  test('generatePasswords returns correct count', () => {
    const passwords = generatePasswords({ ...DEFAULT_OPTIONS, count: 10 });
    expect(passwords.length).toBe(10);
  });

  test('generates unique passwords', () => {
    const passwords = generatePasswords({ ...DEFAULT_OPTIONS, count: 10, length: 32 });
    const unique = new Set(passwords);
    expect(unique.size).toBe(10);
  });
});

describe('estimateStrength', () => {
  test('short password is weak', () => {
    expect(estimateStrength('ab').score).toBeLessThanOrEqual(1);
  });

  test('long mixed password is strong', () => {
    expect(estimateStrength('Abc123!@#DefGhi456').score).toBeGreaterThanOrEqual(3);
  });

  test('empty password is very weak', () => {
    expect(estimateStrength('').score).toBe(0);
  });
});
