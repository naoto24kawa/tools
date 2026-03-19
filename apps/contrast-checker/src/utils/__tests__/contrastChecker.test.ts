import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  relativeLuminance,
  contrastRatio,
  meetsWCAG,
  isValidHex,
} from '../contrastChecker';

describe('hexToRgb', () => {
  it('parses 6-digit hex', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('parses 3-digit hex', () => {
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
  });
});

describe('relativeLuminance', () => {
  it('returns 0 for black', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 4);
  });

  it('returns 1 for white', () => {
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 4);
  });
});

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('returns 1 for same colors', () => {
    expect(contrastRatio('#ff0000', '#ff0000')).toBeCloseTo(1, 2);
  });

  it('is commutative', () => {
    const r1 = contrastRatio('#336699', '#ffffff');
    const r2 = contrastRatio('#ffffff', '#336699');
    expect(r1).toBeCloseTo(r2, 4);
  });
});

describe('meetsWCAG', () => {
  it('AA normal requires 4.5:1', () => {
    expect(meetsWCAG(4.5, 'AA', 'normal')).toBe(true);
    expect(meetsWCAG(4.49, 'AA', 'normal')).toBe(false);
  });

  it('AA large requires 3:1', () => {
    expect(meetsWCAG(3, 'AA', 'large')).toBe(true);
    expect(meetsWCAG(2.99, 'AA', 'large')).toBe(false);
  });

  it('AAA normal requires 7:1', () => {
    expect(meetsWCAG(7, 'AAA', 'normal')).toBe(true);
    expect(meetsWCAG(6.99, 'AAA', 'normal')).toBe(false);
  });

  it('AAA large requires 4.5:1', () => {
    expect(meetsWCAG(4.5, 'AAA', 'large')).toBe(true);
    expect(meetsWCAG(4.49, 'AAA', 'large')).toBe(false);
  });
});

describe('isValidHex', () => {
  it('accepts valid hex colors', () => {
    expect(isValidHex('#000')).toBe(true);
    expect(isValidHex('#fff')).toBe(true);
    expect(isValidHex('#000000')).toBe(true);
    expect(isValidHex('#AbCdEf')).toBe(true);
  });

  it('rejects invalid hex colors', () => {
    expect(isValidHex('000000')).toBe(false);
    expect(isValidHex('#00')).toBe(false);
    expect(isValidHex('#0000')).toBe(false);
    expect(isValidHex('#gggggg')).toBe(false);
  });
});
