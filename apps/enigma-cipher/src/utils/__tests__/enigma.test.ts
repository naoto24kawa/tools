import { describe, expect, test } from 'bun:test';
import { DEFAULT_CONFIG, enigmaEncrypt } from '../enigma';

describe('enigma', () => {
  test('encrypts letter', () => {
    const result = enigmaEncrypt('A', DEFAULT_CONFIG);
    expect(result).not.toBe('A');
    expect(result.length).toBe(1);
  });

  test('is reciprocal (decrypt = encrypt with same config)', () => {
    const encrypted = enigmaEncrypt('HELLO', DEFAULT_CONFIG);
    const decrypted = enigmaEncrypt(encrypted, DEFAULT_CONFIG);
    expect(decrypted).toBe('HELLO');
  });

  test('preserves non-alpha characters', () => {
    const result = enigmaEncrypt('A B!', DEFAULT_CONFIG);
    expect(result).toContain(' ');
    expect(result).toContain('!');
  });

  test('produces uppercase output', () => {
    const result = enigmaEncrypt('hello', DEFAULT_CONFIG);
    expect(result).toMatch(/^[A-Z ]*$/);
  });
});
