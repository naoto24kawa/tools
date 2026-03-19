import { describe, expect, it } from 'vitest';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  generatePalette,
  exportAsCssVariables,
  isValidHex,
} from '../paletteGenerator';

describe('paletteGenerator', () => {
  describe('hexToRgb', () => {
    it('converts black', () => {
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('converts white', () => {
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('converts red', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('handles without hash', () => {
      expect(hexToRgb('00ff00')).toEqual({ r: 0, g: 255, b: 0 });
    });
  });

  describe('rgbToHex', () => {
    it('converts black', () => {
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    });

    it('converts white', () => {
      expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
    });

    it('converts blue', () => {
      expect(rgbToHex({ r: 0, g: 0, b: 255 })).toBe('#0000ff');
    });
  });

  describe('rgbToHsl', () => {
    it('converts red', () => {
      const hsl = rgbToHsl({ r: 255, g: 0, b: 0 });
      expect(hsl.h).toBe(0);
      expect(hsl.s).toBe(100);
      expect(hsl.l).toBe(50);
    });

    it('converts gray', () => {
      const hsl = rgbToHsl({ r: 128, g: 128, b: 128 });
      expect(hsl.h).toBe(0);
      expect(hsl.s).toBe(0);
      expect(hsl.l).toBe(50);
    });
  });

  describe('hslToRgb', () => {
    it('converts pure red', () => {
      const rgb = hslToRgb({ h: 0, s: 100, l: 50 });
      expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('converts gray (no saturation)', () => {
      const rgb = hslToRgb({ h: 0, s: 0, l: 50 });
      expect(rgb).toEqual({ r: 128, g: 128, b: 128 });
    });
  });

  describe('generatePalette', () => {
    it('generates complementary palette with 2 colors', () => {
      const palette = generatePalette('#ff0000', 'complementary');
      expect(palette).toHaveLength(2);
    });

    it('generates analogous palette with 3 colors', () => {
      const palette = generatePalette('#ff0000', 'analogous');
      expect(palette).toHaveLength(3);
    });

    it('generates triadic palette with 3 colors', () => {
      const palette = generatePalette('#ff0000', 'triadic');
      expect(palette).toHaveLength(3);
    });

    it('generates split-complementary palette with 3 colors', () => {
      const palette = generatePalette('#ff0000', 'split-complementary');
      expect(palette).toHaveLength(3);
    });

    it('generates tetradic palette with 4 colors', () => {
      const palette = generatePalette('#ff0000', 'tetradic');
      expect(palette).toHaveLength(4);
    });

    it('returns valid hex values', () => {
      const palette = generatePalette('#3366cc', 'triadic');
      for (const color of palette) {
        expect(color.hex).toMatch(/^#[0-9a-f]{6}$/);
      }
    });

    it('includes base color as first element', () => {
      const palette = generatePalette('#ff0000', 'complementary');
      expect(palette[0].hex).toBe('#ff0000');
    });
  });

  describe('exportAsCssVariables', () => {
    it('generates valid CSS custom properties', () => {
      const colors = generatePalette('#ff0000', 'complementary');
      const css = exportAsCssVariables(colors);
      expect(css).toContain(':root {');
      expect(css).toContain('--palette-1:');
      expect(css).toContain('--palette-2:');
    });

    it('uses custom prefix', () => {
      const colors = generatePalette('#ff0000', 'complementary');
      const css = exportAsCssVariables(colors, 'color');
      expect(css).toContain('--color-1:');
    });
  });

  describe('isValidHex', () => {
    it('accepts valid hex', () => {
      expect(isValidHex('#ff0000')).toBe(true);
      expect(isValidHex('#AABBCC')).toBe(true);
    });

    it('rejects invalid hex', () => {
      expect(isValidHex('ff0000')).toBe(false);
      expect(isValidHex('#fff')).toBe(false);
      expect(isValidHex('#gggggg')).toBe(false);
    });
  });
});
