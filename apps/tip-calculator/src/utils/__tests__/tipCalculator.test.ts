import { describe, it, expect } from 'vitest';
import { calculateTip, calculateTipComparison } from '../tipCalculator';

describe('tipCalculator', () => {
  describe('calculateTip', () => {
    it('should calculate 15% tip correctly', () => {
      const result = calculateTip({
        billAmount: 10000,
        tipPercent: 15,
        numPeople: 1,
        rounding: 'nearest',
      });
      expect(result.tipAmount).toBe(1500);
      expect(result.totalAmount).toBe(11500);
    });

    it('should calculate 20% tip correctly', () => {
      const result = calculateTip({
        billAmount: 5000,
        tipPercent: 20,
        numPeople: 1,
        rounding: 'nearest',
      });
      expect(result.tipAmount).toBe(1000);
      expect(result.totalAmount).toBe(6000);
    });

    it('should split evenly among people', () => {
      const result = calculateTip({
        billAmount: 10000,
        tipPercent: 10,
        numPeople: 4,
        rounding: 'nearest',
      });
      expect(result.tipAmount).toBe(1000);
      expect(result.totalAmount).toBe(11000);
      expect(result.perPersonTotal).toBe(2750);
    });

    it('should round up', () => {
      const result = calculateTip({
        billAmount: 3333,
        tipPercent: 15,
        numPeople: 1,
        rounding: 'up',
      });
      // 3333 * 0.15 = 499.95 -> ceil = 500
      expect(result.tipAmount).toBe(500);
    });

    it('should round down', () => {
      const result = calculateTip({
        billAmount: 3333,
        tipPercent: 15,
        numPeople: 1,
        rounding: 'down',
      });
      // 3333 * 0.15 = 499.95 -> floor = 499
      expect(result.tipAmount).toBe(499);
    });

    it('should round to nearest', () => {
      const result = calculateTip({
        billAmount: 3333,
        tipPercent: 15,
        numPeople: 1,
        rounding: 'nearest',
      });
      // 3333 * 0.15 = 499.95 -> round = 500
      expect(result.tipAmount).toBe(500);
    });

    it('should handle 0% tip', () => {
      const result = calculateTip({
        billAmount: 5000,
        tipPercent: 0,
        numPeople: 2,
        rounding: 'nearest',
      });
      expect(result.tipAmount).toBe(0);
      expect(result.totalAmount).toBe(5000);
      expect(result.perPersonTotal).toBe(2500);
    });

    it('should handle zero bill amount', () => {
      const result = calculateTip({
        billAmount: 0,
        tipPercent: 15,
        numPeople: 1,
        rounding: 'nearest',
      });
      expect(result.tipAmount).toBe(0);
      expect(result.totalAmount).toBe(0);
    });

    it('should throw for negative bill', () => {
      expect(() =>
        calculateTip({
          billAmount: -100,
          tipPercent: 15,
          numPeople: 1,
          rounding: 'nearest',
        }),
      ).toThrow('Bill amount must be non-negative');
    });

    it('should throw for negative tip percent', () => {
      expect(() =>
        calculateTip({
          billAmount: 1000,
          tipPercent: -5,
          numPeople: 1,
          rounding: 'nearest',
        }),
      ).toThrow('Tip percent must be non-negative');
    });

    it('should throw for zero people', () => {
      expect(() =>
        calculateTip({
          billAmount: 1000,
          tipPercent: 15,
          numPeople: 0,
          rounding: 'nearest',
        }),
      ).toThrow('Number of people must be at least 1');
    });

    it('should handle per-person rounding with odd split', () => {
      const result = calculateTip({
        billAmount: 10000,
        tipPercent: 15,
        numPeople: 3,
        rounding: 'up',
      });
      // perPersonTotal = ceil(11500 / 3) = ceil(3833.33) = 3834
      expect(result.perPersonTotal).toBe(3834);
    });
  });

  describe('calculateTipComparison', () => {
    it('should calculate tips for multiple percentages', () => {
      const results = calculateTipComparison(10000, [10, 15, 20], 1, 'nearest');
      expect(results).toHaveLength(3);
      expect(results[0].tipAmount).toBe(1000);
      expect(results[1].tipAmount).toBe(1500);
      expect(results[2].tipAmount).toBe(2000);
    });

    it('should handle empty percentages array', () => {
      const results = calculateTipComparison(10000, [], 1, 'nearest');
      expect(results).toHaveLength(0);
    });
  });
});
