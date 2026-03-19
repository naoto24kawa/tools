import { describe, expect, it } from 'vitest';
import { calculate, fromRatio, formatRatio, formatDecimal } from '../aspectRatio';

describe('aspectRatio', () => {
  describe('calculate', () => {
    it('calculates 1920x1080 as 16:9', () => {
      const result = calculate(1920, 1080);
      expect(result.ratioWidth).toBe(16);
      expect(result.ratioHeight).toBe(9);
    });

    it('calculates 800x600 as 4:3', () => {
      const result = calculate(800, 600);
      expect(result.ratioWidth).toBe(4);
      expect(result.ratioHeight).toBe(3);
    });

    it('calculates 1000x1000 as 1:1', () => {
      const result = calculate(1000, 1000);
      expect(result.ratioWidth).toBe(1);
      expect(result.ratioHeight).toBe(1);
    });

    it('returns decimal value', () => {
      const result = calculate(1920, 1080);
      expect(result.decimal).toBeCloseTo(1.7778, 3);
    });

    it('handles zero width', () => {
      const result = calculate(0, 100);
      expect(result.ratioWidth).toBe(0);
      expect(result.ratioHeight).toBe(0);
    });

    it('handles zero height', () => {
      const result = calculate(100, 0);
      expect(result.ratioWidth).toBe(0);
      expect(result.ratioHeight).toBe(0);
    });

    it('handles negative values', () => {
      const result = calculate(-100, 200);
      expect(result.ratioWidth).toBe(0);
    });
  });

  describe('fromRatio', () => {
    it('calculates height from width and 16:9 ratio', () => {
      const result = fromRatio(16, 9, 'width', 1920);
      expect(result.width).toBe(1920);
      expect(result.height).toBe(1080);
    });

    it('calculates width from height and 16:9 ratio', () => {
      const result = fromRatio(16, 9, 'height', 1080);
      expect(result.width).toBe(1920);
      expect(result.height).toBe(1080);
    });

    it('calculates for 4:3 ratio', () => {
      const result = fromRatio(4, 3, 'width', 800);
      expect(result.height).toBe(600);
    });

    it('calculates for 1:1 ratio', () => {
      const result = fromRatio(1, 1, 'width', 500);
      expect(result.height).toBe(500);
    });

    it('handles zero ratio width', () => {
      const result = fromRatio(0, 9, 'width', 1920);
      expect(result.width).toBe(0);
      expect(result.height).toBe(0);
    });

    it('handles zero known value', () => {
      const result = fromRatio(16, 9, 'width', 0);
      expect(result.width).toBe(0);
      expect(result.height).toBe(0);
    });
  });

  describe('formatRatio', () => {
    it('formats valid ratio', () => {
      expect(formatRatio(16, 9)).toBe('16:9');
    });

    it('returns dash for zero values', () => {
      expect(formatRatio(0, 9)).toBe('-');
      expect(formatRatio(16, 0)).toBe('-');
    });
  });

  describe('formatDecimal', () => {
    it('formats decimal to 4 places', () => {
      expect(formatDecimal(1.7778)).toBe('1.7778');
    });

    it('returns dash for zero', () => {
      expect(formatDecimal(0)).toBe('-');
    });

    it('returns dash for negative', () => {
      expect(formatDecimal(-1)).toBe('-');
    });
  });
});
