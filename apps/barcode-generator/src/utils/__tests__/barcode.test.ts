import { describe, expect, test } from 'bun:test';
import { DEFAULT_OPTIONS, validateInput } from '../barcode';

describe('barcode', () => {
  test('validates CODE128', () => {
    expect(validateInput('Hello123', 'CODE128')).toBe(true);
    expect(validateInput('', 'CODE128')).toBe(false);
  });
  test('validates EAN13', () => {
    expect(validateInput('1234567890123', 'EAN13')).toBe(true);
    expect(validateInput('123', 'EAN13')).toBe(false);
  });
  test('validates CODE39', () => {
    expect(validateInput('HELLO', 'CODE39')).toBe(true);
  });
  test('default options valid', () => {
    expect(DEFAULT_OPTIONS.width).toBeGreaterThan(0);
    expect(DEFAULT_OPTIONS.height).toBeGreaterThan(0);
  });
});
