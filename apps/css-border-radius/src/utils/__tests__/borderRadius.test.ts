import { describe, expect, test } from 'bun:test';
import { DEFAULT_CONFIG, generateCSS } from '../borderRadius';

describe('borderRadius', () => {
  test('uniform radius', () => {
    expect(generateCSS(DEFAULT_CONFIG)).toBe('border-radius: 16px;');
  });

  test('different corners', () => {
    const config = {
      ...DEFAULT_CONFIG,
      topLeft: 10,
      topRight: 20,
      bottomRight: 30,
      bottomLeft: 40,
      linked: false,
    };
    expect(generateCSS(config)).toBe('border-radius: 10px 20px 30px 40px;');
  });

  test('percent unit', () => {
    expect(generateCSS({ ...DEFAULT_CONFIG, unit: '%' })).toBe('border-radius: 16%;');
  });

  test('zero radius', () => {
    const config = { ...DEFAULT_CONFIG, topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 };
    expect(generateCSS(config)).toBe('border-radius: 0px;');
  });
});
