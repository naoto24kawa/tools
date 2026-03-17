import { describe, expect, test } from 'bun:test';
import { generateHash, verifyHash } from '../bcryptHash';

describe('bcryptHash', () => {
  test('generates a valid bcrypt hash', () => {
    const hash = generateHash('password', 4);
    expect(hash).toMatch(/^\$2[aby]?\$\d{2}\$/);
  });

  test('verify returns true for correct password', () => {
    const hash = generateHash('test123', 4);
    expect(verifyHash('test123', hash)).toBe(true);
  });

  test('verify returns false for wrong password', () => {
    const hash = generateHash('test123', 4);
    expect(verifyHash('wrong', hash)).toBe(false);
  });

  test('verify returns false for invalid hash', () => {
    expect(verifyHash('test', 'invalidhash')).toBe(false);
  });

  test('different rounds produce different length computation', () => {
    const hash4 = generateHash('test', 4);
    const hash8 = generateHash('test', 8);
    // Both should be valid bcrypt hashes
    expect(hash4).toMatch(/^\$2[aby]?\$/);
    expect(hash8).toMatch(/^\$2[aby]?\$/);
    // But different (different salts)
    expect(hash4).not.toBe(hash8);
  });
});
