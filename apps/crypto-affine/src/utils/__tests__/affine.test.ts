import { describe, expect, test } from 'vitest';
import { affineDecrypt, affineEncrypt, isValidA } from '../affine';

describe('affine', () => {
  test('encrypt a=5,b=8', () => {
    expect(affineEncrypt('HELLO', 5, 8)).toBe('RCLLA');
  });
  test('decrypt a=5,b=8', () => {
    expect(affineDecrypt('RCLLA', 5, 8)).toBe('HELLO');
  });
  test('preserves case', () => {
    expect(affineEncrypt('Hello', 5, 8)).toBe('Rclla');
  });
  test('preserves non-alpha', () => {
    expect(affineEncrypt('Hello!', 5, 8)).toBe('Rclla!');
  });
  test('round-trip', () => {
    expect(affineDecrypt(affineEncrypt('Test 123', 7, 3), 7, 3)).toBe('Test 123');
  });
  test('isValidA: 5 is valid', () => {
    expect(isValidA(5)).toBe(true);
  });
  test('isValidA: 2 is invalid', () => {
    expect(isValidA(2)).toBe(false);
  });
  test('isValidA: 13 is invalid', () => {
    expect(isValidA(13)).toBe(false);
  });
  test('empty string', () => {
    expect(affineEncrypt('', 5, 8)).toBe('');
  });
});
