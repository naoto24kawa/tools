import { describe, expect, test } from 'bun:test';
import { rot13, rot18, rot47 } from '../rot';

describe('rot', () => {
  describe('rot13', () => {
    test('basic', () => {
      expect(rot13('Hello')).toBe('Uryyb');
    });
    test('double rot13 returns original', () => {
      expect(rot13(rot13('Hello World!'))).toBe('Hello World!');
    });
    test('preserves non-alpha', () => {
      expect(rot13('123!@#')).toBe('123!@#');
    });
    test('empty', () => {
      expect(rot13('')).toBe('');
    });
    test('all uppercase', () => {
      expect(rot13('ABC')).toBe('NOP');
    });
    test('all lowercase', () => {
      expect(rot13('abc')).toBe('nop');
    });
  });

  describe('rot18', () => {
    test('rotates letters and numbers', () => {
      expect(rot18('Hello 123')).toBe('Uryyb 678');
    });
    test('double rot18 returns original', () => {
      expect(rot18(rot18('Test 42!'))).toBe('Test 42!');
    });
    test('preserves symbols', () => {
      expect(rot18('!@#')).toBe('!@#');
    });
  });

  describe('rot47', () => {
    test('rotates printable ASCII', () => {
      expect(rot47('Hello')).toBe('w6==@');
    });
    test('double rot47 returns original', () => {
      expect(rot47(rot47('Hello World! 123'))).toBe('Hello World! 123');
    });
    test('preserves non-printable', () => {
      expect(rot47('\n\t')).toBe('\n\t');
    });
  });
});
