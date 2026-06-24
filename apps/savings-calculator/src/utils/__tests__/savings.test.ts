import { describe, it, expect } from 'vitest';
import { calcSavings, calcRequiredMonthly } from '../savings';

describe('savings', () => {
  describe('calcSavings', () => {
    it('月1万・10年・年利0%→元本のみ120万', () => {
      const result = calcSavings({ monthlyAmount: 10000, years: 10, annualRate: 0 });
      expect(result.principal).toBe(1200000);
      expect(result.interest).toBeCloseTo(0, 0);
      expect(result.total).toBeCloseTo(1200000, 0);
    });

    it('月1万・10年・年利3%→利息が加算される', () => {
      const result = calcSavings({ monthlyAmount: 10000, years: 10, annualRate: 3 });
      expect(result.total).toBeGreaterThan(1200000);
      expect(result.interest).toBeGreaterThan(0);
    });

    it('初期金額あり→正しく合算', () => {
      const result = calcSavings({
        monthlyAmount: 0,
        years: 1,
        annualRate: 12,
        initialAmount: 100000,
      });
      // 100000 × (1.01)^12 ≈ 112682
      expect(result.total).toBeCloseTo(112682, -2);
    });

    it('yearlyBreakdown の長さが years と一致', () => {
      const result = calcSavings({ monthlyAmount: 10000, years: 5, annualRate: 2 });
      expect(result.yearlyBreakdown).toHaveLength(5);
    });

    it('yearlyBreakdown は昇順', () => {
      const result = calcSavings({ monthlyAmount: 10000, years: 3, annualRate: 2 });
      const balances = result.yearlyBreakdown.map((e) => e.balance);
      expect(balances[0]).toBeLessThan(balances[1]);
      expect(balances[1]).toBeLessThan(balances[2]);
    });

    it('月額負値は例外を投げる', () => {
      expect(() =>
        calcSavings({ monthlyAmount: -1, years: 10, annualRate: 3 }),
      ).toThrow('Monthly amount must be non-negative');
    });

    it('期間0は例外を投げる', () => {
      expect(() =>
        calcSavings({ monthlyAmount: 10000, years: 0, annualRate: 3 }),
      ).toThrow('Years must be positive');
    });
  });

  describe('calcRequiredMonthly', () => {
    it('目標100万・10年・年利0%→月8333円', () => {
      const monthly = calcRequiredMonthly(1000000, 10, 0);
      expect(monthly).toBeCloseTo(8333.33, 0);
    });

    it('目標100万・10年・年利3%→複利公式で算出', () => {
      // PMT = FV × r / ((1+r)^n - 1)  where r=0.0025, n=120
      const monthly = calcRequiredMonthly(1000000, 10, 3);
      expect(monthly).toBeCloseTo(7156, 0);
    });

    it('目標額負値は例外を投げる', () => {
      expect(() => calcRequiredMonthly(-1, 10, 3)).toThrow('Target must be positive');
    });
  });
});
