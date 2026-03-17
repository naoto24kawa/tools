import { describe, expect, test } from 'bun:test';
import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from '../colorConverter';

describe('colorConverter', () => {
  describe('hexToRgb', () => {
    test('converts 6-digit hex', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    test('converts 3-digit hex', () => {
      expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
    });

    test('converts without hash', () => {
      expect(hexToRgb('00ff00')).toEqual({ r: 0, g: 255, b: 0 });
    });

    test('returns null for invalid hex', () => {
      expect(hexToRgb('xyz')).toBeNull();
    });

    test('black', () => {
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    test('white', () => {
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    });
  });

  describe('rgbToHex', () => {
    test('converts to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
    });

    test('pads with zeros', () => {
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
    });

    test('clamps values', () => {
      expect(rgbToHex(300, -10, 128)).toBe('#ff0080');
    });
  });

  describe('rgbToHsl', () => {
    test('red', () => {
      expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 });
    });

    test('black', () => {
      expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 });
    });

    test('white', () => {
      expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 });
    });

    test('green', () => {
      const hsl = rgbToHsl(0, 255, 0);
      expect(hsl.h).toBe(120);
    });

    test('blue', () => {
      const hsl = rgbToHsl(0, 0, 255);
      expect(hsl.h).toBe(240);
    });
  });

  describe('hslToRgb', () => {
    test('red', () => {
      expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
    });

    test('gray', () => {
      expect(hslToRgb(0, 0, 50)).toEqual({ r: 128, g: 128, b: 128 });
    });
  });

  describe('round-trip', () => {
    test('hex -> rgb -> hex', () => {
      const rgb = hexToRgb('#3b82f6');
      expect(rgb).not.toBeNull();
      if (rgb) expect(rgbToHex(rgb.r, rgb.g, rgb.b)).toBe('#3b82f6');
    });

    test('rgb -> hsl -> rgb', () => {
      const hsl = rgbToHsl(100, 150, 200);
      const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      expect(Math.abs(rgb.r - 100)).toBeLessThanOrEqual(2);
      expect(Math.abs(rgb.g - 150)).toBeLessThanOrEqual(2);
      expect(Math.abs(rgb.b - 200)).toBeLessThanOrEqual(2);
    });
  });
});
