import { describe, expect, it } from 'vitest';
import {
  generateFilterCss,
  generateFilterStyleValue,
  isDefault,
  DEFAULT_FILTER_VALUES,
} from '../filterGenerator';

describe('filterGenerator', () => {
  describe('generateFilterCss', () => {
    it('returns none for default values', () => {
      expect(generateFilterCss(DEFAULT_FILTER_VALUES)).toBe('filter: none;');
    });

    it('includes blur when non-zero', () => {
      const values = { ...DEFAULT_FILTER_VALUES, blur: 5 };
      const css = generateFilterCss(values);
      expect(css).toContain('blur(5px)');
    });

    it('includes brightness when non-default', () => {
      const values = { ...DEFAULT_FILTER_VALUES, brightness: 150 };
      const css = generateFilterCss(values);
      expect(css).toContain('brightness(150%)');
    });

    it('includes contrast when non-default', () => {
      const values = { ...DEFAULT_FILTER_VALUES, contrast: 200 };
      const css = generateFilterCss(values);
      expect(css).toContain('contrast(200%)');
    });

    it('includes hue-rotate with deg unit', () => {
      const values = { ...DEFAULT_FILTER_VALUES, hueRotate: 90 };
      const css = generateFilterCss(values);
      expect(css).toContain('hue-rotate(90deg)');
    });

    it('combines multiple filters', () => {
      const values = { ...DEFAULT_FILTER_VALUES, blur: 2, grayscale: 50, sepia: 30 };
      const css = generateFilterCss(values);
      expect(css).toContain('blur(2px)');
      expect(css).toContain('grayscale(50%)');
      expect(css).toContain('sepia(30%)');
      expect(css).toContain('filter:');
    });

    it('starts with filter:', () => {
      const values = { ...DEFAULT_FILTER_VALUES, blur: 1 };
      expect(generateFilterCss(values)).toMatch(/^filter:/);
    });
  });

  describe('generateFilterStyleValue', () => {
    it('returns none for default values', () => {
      expect(generateFilterStyleValue(DEFAULT_FILTER_VALUES)).toBe('none');
    });

    it('returns just the filter value without property name', () => {
      const values = { ...DEFAULT_FILTER_VALUES, blur: 3 };
      const result = generateFilterStyleValue(values);
      expect(result).toBe('blur(3px)');
      expect(result).not.toContain('filter:');
    });
  });

  describe('isDefault', () => {
    it('returns true for default values', () => {
      expect(isDefault(DEFAULT_FILTER_VALUES)).toBe(true);
    });

    it('returns false when any value differs', () => {
      expect(isDefault({ ...DEFAULT_FILTER_VALUES, blur: 1 })).toBe(false);
      expect(isDefault({ ...DEFAULT_FILTER_VALUES, brightness: 50 })).toBe(false);
      expect(isDefault({ ...DEFAULT_FILTER_VALUES, sepia: 10 })).toBe(false);
    });
  });
});
