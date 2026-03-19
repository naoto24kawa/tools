import { describe, expect, it } from 'vitest';
import {
  generateTextShadowValue,
  generateTextShadowCss,
  hexToRgba,
  parseRgbaAlpha,
  parseRgbaHex,
  type ShadowLayer,
} from '../textShadowGenerator';

describe('textShadowGenerator', () => {
  const makeShadow = (overrides?: Partial<ShadowLayer>): ShadowLayer => ({
    id: 'test-1',
    offsetX: 2,
    offsetY: 2,
    blur: 4,
    color: 'rgba(0, 0, 0, 0.5)',
    ...overrides,
  });

  describe('generateTextShadowValue', () => {
    it('returns none for empty layers', () => {
      expect(generateTextShadowValue([])).toBe('none');
    });

    it('generates single shadow value', () => {
      const layers = [makeShadow()];
      const result = generateTextShadowValue(layers);
      expect(result).toBe('2px 2px 4px rgba(0, 0, 0, 0.5)');
    });

    it('generates multiple shadow values separated by commas', () => {
      const layers = [
        makeShadow({ id: '1' }),
        makeShadow({ id: '2', offsetX: 5, offsetY: 5, blur: 10, color: 'rgba(255, 0, 0, 0.3)' }),
      ];
      const result = generateTextShadowValue(layers);
      expect(result).toContain('2px 2px 4px');
      expect(result).toContain('5px 5px 10px');
      expect(result).toContain(', ');
    });

    it('handles negative offsets', () => {
      const layers = [makeShadow({ offsetX: -3, offsetY: -5 })];
      const result = generateTextShadowValue(layers);
      expect(result).toContain('-3px -5px');
    });

    it('handles zero blur', () => {
      const layers = [makeShadow({ blur: 0 })];
      const result = generateTextShadowValue(layers);
      expect(result).toContain('0px');
    });
  });

  describe('generateTextShadowCss', () => {
    it('wraps value in text-shadow property', () => {
      const layers = [makeShadow()];
      const css = generateTextShadowCss(layers);
      expect(css).toBe('text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);');
    });

    it('returns text-shadow: none for empty', () => {
      expect(generateTextShadowCss([])).toBe('text-shadow: none;');
    });
  });

  describe('hexToRgba', () => {
    it('converts black hex with alpha', () => {
      expect(hexToRgba('#000000', 0.5)).toBe('rgba(0, 0, 0, 0.5)');
    });

    it('converts red hex with full alpha', () => {
      expect(hexToRgba('#ff0000', 1)).toBe('rgba(255, 0, 0, 1)');
    });

    it('converts white hex with zero alpha', () => {
      expect(hexToRgba('#ffffff', 0)).toBe('rgba(255, 255, 255, 0)');
    });
  });

  describe('parseRgbaAlpha', () => {
    it('extracts alpha from rgba string', () => {
      expect(parseRgbaAlpha('rgba(0, 0, 0, 0.5)')).toBe(0.5);
    });

    it('returns 1 for rgb without alpha', () => {
      expect(parseRgbaAlpha('rgb(0, 0, 0)')).toBe(1);
    });

    it('handles alpha of 1', () => {
      expect(parseRgbaAlpha('rgba(255, 255, 255, 1)')).toBe(1);
    });
  });

  describe('parseRgbaHex', () => {
    it('extracts hex from rgba string', () => {
      expect(parseRgbaHex('rgba(255, 0, 0, 0.5)')).toBe('#ff0000');
    });

    it('returns #000000 for invalid input', () => {
      expect(parseRgbaHex('invalid')).toBe('#000000');
    });

    it('handles single digit values', () => {
      expect(parseRgbaHex('rgba(0, 0, 0, 1)')).toBe('#000000');
    });
  });
});
