import { describe, expect, test } from 'vitest';
import type { PasswordOptions } from '../passwordGenerator';
import { calculateStrength, generatePassword } from '../passwordGenerator';

describe('generatePassword', () => {
  test('generates password of correct length', () => {
    const options: PasswordOptions = {
      length: 24,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeAmbiguous: false,
    };
    const password = generatePassword(options);
    expect(password).toHaveLength(24);
  });

  test('uses only selected character sets', () => {
    const options: PasswordOptions = {
      length: 100,
      uppercase: false,
      lowercase: true,
      numbers: false,
      symbols: false,
      excludeAmbiguous: false,
    };
    const password = generatePassword(options);
    expect(password).toMatch(/^[a-z]+$/);
  });

  test('returns empty string when no character sets selected', () => {
    const options: PasswordOptions = {
      length: 16,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
      excludeAmbiguous: false,
    };
    const password = generatePassword(options);
    expect(password).toBe('');
  });

  test('excludeAmbiguous removes ambiguous characters', () => {
    const options: PasswordOptions = {
      length: 200,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
      excludeAmbiguous: true,
    };
    const password = generatePassword(options);
    expect(password).not.toMatch(/[lI1O0]/);
  });
});

describe('calculateStrength', () => {
  test('calculates strength score correctly', () => {
    // Empty password
    expect(calculateStrength('').score).toBe(0);
    expect(calculateStrength('').label).toBe('Very Weak');

    // Short lowercase only
    expect(calculateStrength('abc').score).toBe(1);

    // Long mixed password
    const strong = calculateStrength('Abc123!@#longpassword');
    expect(strong.score).toBe(7);
    expect(strong.label).toBe('Maximum');
  });
});
