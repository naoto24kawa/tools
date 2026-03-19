import { describe, it, expect } from 'vitest';
import {
  toInclusive,
  toExclusive,
  calculateTax,
  calculateBatch,
} from '../taxCalculator';

describe('taxCalculator', () => {
  describe('toInclusive', () => {
    it('should calculate 10% tax correctly', () => {
      const result = toInclusive(1000, 0.1);
      expect(result.exclusive).toBe(1000);
      expect(result.tax).toBe(100);
      expect(result.inclusive).toBe(1100);
      expect(result.rate).toBe(0.1);
    });

    it('should calculate 8% tax correctly', () => {
      const result = toInclusive(1000, 0.08);
      expect(result.exclusive).toBe(1000);
      expect(result.tax).toBe(80);
      expect(result.inclusive).toBe(1080);
      expect(result.rate).toBe(0.08);
    });

    it('should floor tax amount for non-round numbers', () => {
      const result = toInclusive(999, 0.1);
      expect(result.tax).toBe(99); // 999 * 0.1 = 99.9 -> floor = 99
      expect(result.inclusive).toBe(1098);
    });

    it('should handle zero amount', () => {
      const result = toInclusive(0, 0.1);
      expect(result.exclusive).toBe(0);
      expect(result.tax).toBe(0);
      expect(result.inclusive).toBe(0);
    });

    it('should floor 8% tax for non-round numbers', () => {
      const result = toInclusive(150, 0.08);
      expect(result.tax).toBe(12); // 150 * 0.08 = 12.0
      expect(result.inclusive).toBe(162);
    });
  });

  describe('toExclusive', () => {
    it('should extract 10% tax from inclusive amount', () => {
      const result = toExclusive(1100, 0.1);
      expect(result.inclusive).toBe(1100);
      expect(result.exclusive).toBe(1000);
      expect(result.tax).toBe(100);
    });

    it('should extract 8% tax from inclusive amount', () => {
      const result = toExclusive(1080, 0.08);
      expect(result.inclusive).toBe(1080);
      expect(result.exclusive).toBe(1000);
      expect(result.tax).toBe(80);
    });

    it('should handle zero amount', () => {
      const result = toExclusive(0, 0.1);
      expect(result.exclusive).toBe(0);
      expect(result.tax).toBe(0);
      expect(result.inclusive).toBe(0);
    });

    it('should ceil exclusive for non-round numbers', () => {
      const result = toExclusive(1099, 0.1);
      // 1099 / 1.1 = 999.0909... -> ceil = 1000
      expect(result.exclusive).toBe(1000);
      expect(result.tax).toBe(99);
    });
  });

  describe('calculateTax', () => {
    it('should calculate from exclusive amount', () => {
      const result = calculateTax(1000, 0.1, false);
      expect(result.inclusive).toBe(1100);
      expect(result.tax).toBe(100);
    });

    it('should calculate from inclusive amount', () => {
      const result = calculateTax(1100, 0.1, true);
      expect(result.exclusive).toBe(1000);
      expect(result.tax).toBe(100);
    });

    it('should throw for negative amounts', () => {
      expect(() => calculateTax(-100, 0.1, false)).toThrow('Amount must be non-negative');
    });
  });

  describe('calculateBatch', () => {
    it('should calculate multiple items', () => {
      const result = calculateBatch([
        { name: 'Item A', amount: 1000, rate: 0.1, isInclusive: false },
        { name: 'Item B', amount: 500, rate: 0.08, isInclusive: false },
      ]);
      expect(result.items).toHaveLength(2);
      expect(result.items[0].inclusive).toBe(1100);
      expect(result.items[1].inclusive).toBe(540);
      expect(result.totalExclusive).toBe(1500);
      expect(result.totalInclusive).toBe(1640);
      expect(result.totalTax).toBe(140);
    });

    it('should handle empty batch', () => {
      const result = calculateBatch([]);
      expect(result.items).toHaveLength(0);
      expect(result.totalExclusive).toBe(0);
      expect(result.totalInclusive).toBe(0);
      expect(result.totalTax).toBe(0);
    });

    it('should handle mixed inclusive/exclusive items', () => {
      const result = calculateBatch([
        { name: 'A', amount: 1000, rate: 0.1, isInclusive: false },
        { name: 'B', amount: 1080, rate: 0.08, isInclusive: true },
      ]);
      expect(result.items[0].inclusive).toBe(1100);
      expect(result.items[0].tax).toBe(100);
      expect(result.items[1].exclusive).toBe(1000);
      expect(result.items[1].tax).toBe(80);
    });
  });
});
