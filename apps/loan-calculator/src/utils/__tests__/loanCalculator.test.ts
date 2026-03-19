import { describe, it, expect } from 'vitest';
import {
  calculateEqualPayment,
  calculateEqualPrincipal,
} from '../loanCalculator';

describe('loanCalculator', () => {
  describe('calculateEqualPayment', () => {
    it('should calculate equal payment for a simple loan', () => {
      const result = calculateEqualPayment({
        principal: 1000000,
        annualRate: 3.0,
        totalMonths: 12,
      });
      expect(result.schedule).toHaveLength(12);
      expect(result.totalPayment).toBeGreaterThan(1000000);
      expect(result.totalInterest).toBeGreaterThan(0);
      // All payments except last should be equal
      const first = result.schedule[0].payment;
      for (let i = 1; i < 11; i++) {
        expect(result.schedule[i].payment).toBe(first);
      }
    });

    it('should handle zero interest rate', () => {
      const result = calculateEqualPayment({
        principal: 1200000,
        annualRate: 0,
        totalMonths: 12,
      });
      expect(result.totalInterest).toBe(0);
      expect(result.totalPayment).toBe(1200000);
      expect(result.monthlyPaymentFirst).toBe(100000);
    });

    it('should have remaining balance of 0 at end', () => {
      const result = calculateEqualPayment({
        principal: 5000000,
        annualRate: 2.5,
        totalMonths: 60,
      });
      const last = result.schedule[result.schedule.length - 1];
      expect(last.remainingBalance).toBe(0);
    });

    it('should throw for non-positive principal', () => {
      expect(() =>
        calculateEqualPayment({ principal: 0, annualRate: 3, totalMonths: 12 }),
      ).toThrow('Principal must be positive');
    });

    it('should throw for non-positive term', () => {
      expect(() =>
        calculateEqualPayment({ principal: 1000000, annualRate: 3, totalMonths: 0 }),
      ).toThrow('Term must be positive');
    });

    it('should throw for negative rate', () => {
      expect(() =>
        calculateEqualPayment({ principal: 1000000, annualRate: -1, totalMonths: 12 }),
      ).toThrow('Interest rate must be non-negative');
    });

    it('should calculate correct total interest for known values', () => {
      // 1,000,000 yen at 12% per year for 12 months
      const result = calculateEqualPayment({
        principal: 1000000,
        annualRate: 12,
        totalMonths: 12,
      });
      // Monthly rate = 1%, each month ~88849 yen
      expect(result.monthlyPaymentFirst).toBeGreaterThan(88000);
      expect(result.monthlyPaymentFirst).toBeLessThan(89000);
    });
  });

  describe('calculateEqualPrincipal', () => {
    it('should calculate equal principal payments', () => {
      const result = calculateEqualPrincipal({
        principal: 1200000,
        annualRate: 3.0,
        totalMonths: 12,
      });
      expect(result.schedule).toHaveLength(12);
      // Principal part should be constant (100000)
      expect(result.schedule[0].principalPart).toBe(100000);
      expect(result.schedule[5].principalPart).toBe(100000);
    });

    it('should have decreasing monthly payments', () => {
      const result = calculateEqualPrincipal({
        principal: 1200000,
        annualRate: 6.0,
        totalMonths: 12,
      });
      // Payments should decrease over time
      for (let i = 1; i < result.schedule.length; i++) {
        expect(result.schedule[i].payment).toBeLessThanOrEqual(
          result.schedule[i - 1].payment,
        );
      }
    });

    it('should have remaining balance of 0 at end', () => {
      const result = calculateEqualPrincipal({
        principal: 3000000,
        annualRate: 4.5,
        totalMonths: 36,
      });
      const last = result.schedule[result.schedule.length - 1];
      expect(last.remainingBalance).toBe(0);
    });

    it('should handle zero interest rate', () => {
      const result = calculateEqualPrincipal({
        principal: 1200000,
        annualRate: 0,
        totalMonths: 12,
      });
      expect(result.totalInterest).toBe(0);
      expect(result.totalPayment).toBe(1200000);
    });

    it('should throw for invalid input', () => {
      expect(() =>
        calculateEqualPrincipal({ principal: -1, annualRate: 3, totalMonths: 12 }),
      ).toThrow();
    });
  });
});
