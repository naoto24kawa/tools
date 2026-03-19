import { describe, it, expect } from 'vitest';
import {
  calculatePercentageOff,
  calculateAmountOff,
  calculateBuyXGetY,
  calculateBundle,
  calculateDiscount,
} from '../discountCalculator';

describe('discountCalculator', () => {
  describe('calculatePercentageOff', () => {
    it('should calculate 20% off', () => {
      const result = calculatePercentageOff(1000, 20);
      expect(result.finalPrice).toBe(800);
      expect(result.savingsAmount).toBe(200);
      expect(result.savingsPercent).toBe(20);
    });

    it('should calculate 50% off', () => {
      const result = calculatePercentageOff(1500, 50);
      expect(result.finalPrice).toBe(750);
      expect(result.savingsAmount).toBe(750);
    });

    it('should handle 0% off', () => {
      const result = calculatePercentageOff(1000, 0);
      expect(result.finalPrice).toBe(1000);
      expect(result.savingsAmount).toBe(0);
    });

    it('should handle 100% off', () => {
      const result = calculatePercentageOff(1000, 100);
      expect(result.finalPrice).toBe(0);
      expect(result.savingsAmount).toBe(1000);
    });

    it('should floor savings for non-round amounts', () => {
      const result = calculatePercentageOff(999, 33);
      // 999 * 0.33 = 329.67 -> floor = 329
      expect(result.savingsAmount).toBe(329);
      expect(result.finalPrice).toBe(670);
    });

    it('should throw for negative price', () => {
      expect(() => calculatePercentageOff(-100, 20)).toThrow();
    });

    it('should throw for percentage > 100', () => {
      expect(() => calculatePercentageOff(100, 150)).toThrow();
    });
  });

  describe('calculateAmountOff', () => {
    it('should calculate amount off', () => {
      const result = calculateAmountOff(1000, 200);
      expect(result.finalPrice).toBe(800);
      expect(result.savingsAmount).toBe(200);
      expect(result.savingsPercent).toBe(20);
    });

    it('should cap discount at original price', () => {
      const result = calculateAmountOff(500, 1000);
      expect(result.finalPrice).toBe(0);
      expect(result.savingsAmount).toBe(500);
    });

    it('should handle zero discount', () => {
      const result = calculateAmountOff(1000, 0);
      expect(result.finalPrice).toBe(1000);
    });

    it('should throw for negative amount', () => {
      expect(() => calculateAmountOff(1000, -100)).toThrow();
    });
  });

  describe('calculateBuyXGetY', () => {
    it('should calculate buy 2 get 1 free for 3 items', () => {
      const result = calculateBuyXGetY(1000, 2, 1, 3);
      expect(result.originalPrice).toBe(3000);
      expect(result.finalPrice).toBe(2000);
      expect(result.savingsAmount).toBe(1000);
    });

    it('should calculate buy 2 get 1 free for 6 items', () => {
      const result = calculateBuyXGetY(500, 2, 1, 6);
      expect(result.originalPrice).toBe(3000);
      expect(result.finalPrice).toBe(2000); // 2 groups, 4 paid
      expect(result.savingsAmount).toBe(1000);
    });

    it('should handle remainder items (no free)', () => {
      const result = calculateBuyXGetY(1000, 2, 1, 4);
      expect(result.originalPrice).toBe(4000);
      // 1 full group (2 paid, 1 free) + 1 remainder = 3 paid
      expect(result.finalPrice).toBe(3000);
    });

    it('should throw for invalid values', () => {
      expect(() => calculateBuyXGetY(1000, 0, 1, 3)).toThrow();
      expect(() => calculateBuyXGetY(1000, 2, 0, 3)).toThrow();
      expect(() => calculateBuyXGetY(1000, 2, 1, 0)).toThrow();
    });
  });

  describe('calculateBundle', () => {
    it('should calculate bundle pricing', () => {
      const result = calculateBundle(500, 3, 1200, 3);
      expect(result.originalPrice).toBe(1500);
      expect(result.finalPrice).toBe(1200);
      expect(result.savingsAmount).toBe(300);
    });

    it('should handle multiple bundles with remainder', () => {
      const result = calculateBundle(500, 3, 1200, 7);
      expect(result.originalPrice).toBe(3500);
      // 2 bundles (2400) + 1 remainder (500) = 2900
      expect(result.finalPrice).toBe(2900);
      expect(result.savingsAmount).toBe(600);
    });

    it('should handle fewer items than bundle size', () => {
      const result = calculateBundle(500, 3, 1200, 2);
      expect(result.originalPrice).toBe(1000);
      expect(result.finalPrice).toBe(1000); // no bundle applied
      expect(result.savingsAmount).toBe(0);
    });

    it('should throw for invalid values', () => {
      expect(() => calculateBundle(500, 0, 1200, 3)).toThrow();
      expect(() => calculateBundle(500, 3, -1, 3)).toThrow();
    });
  });

  describe('calculateDiscount', () => {
    it('should route to percentage calculator', () => {
      const result = calculateDiscount({
        originalPrice: 1000,
        mode: 'percentage',
        percentageOff: 30,
      });
      expect(result.mode).toBe('percentage');
      expect(result.savingsAmount).toBe(300);
    });

    it('should route to amount calculator', () => {
      const result = calculateDiscount({
        originalPrice: 1000,
        mode: 'amount',
        amountOff: 150,
      });
      expect(result.mode).toBe('amount');
      expect(result.savingsAmount).toBe(150);
    });

    it('should route to buyXgetY calculator', () => {
      const result = calculateDiscount({
        originalPrice: 500,
        mode: 'buyXgetY',
        buyX: 2,
        getY: 1,
        totalItems: 3,
      });
      expect(result.mode).toBe('buyXgetY');
    });

    it('should route to bundle calculator', () => {
      const result = calculateDiscount({
        originalPrice: 500,
        mode: 'bundle',
        bundleSize: 3,
        bundlePrice: 1200,
        bundleItems: 3,
      });
      expect(result.mode).toBe('bundle');
    });
  });
});
