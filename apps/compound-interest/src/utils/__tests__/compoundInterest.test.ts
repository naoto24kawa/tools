import { describe, it, expect } from 'vitest';
import { calculateCompoundInterest } from '../compoundInterest';

describe('compoundInterest', () => {
  it('should calculate simple compound interest yearly', () => {
    const result = calculateCompoundInterest({
      principal: 1000000,
      annualRate: 5,
      years: 1,
      frequency: 'yearly',
      monthlyContribution: 0,
    });
    expect(result.finalAmount).toBe(1050000);
    expect(result.totalInterest).toBe(50000);
  });

  it('should calculate compound interest over multiple years', () => {
    const result = calculateCompoundInterest({
      principal: 1000000,
      annualRate: 5,
      years: 10,
      frequency: 'yearly',
      monthlyContribution: 0,
    });
    // 1000000 * (1.05)^10 = 1628894.6...
    expect(result.finalAmount).toBe(1628895);
    expect(result.yearlySnapshots).toHaveLength(10);
  });

  it('should calculate monthly compounding', () => {
    const result = calculateCompoundInterest({
      principal: 1000000,
      annualRate: 12,
      years: 1,
      frequency: 'monthly',
      monthlyContribution: 0,
    });
    // Monthly rate = 1%, compounded 12 times
    // 1000000 * (1.01)^12 = 1126825.03...
    expect(result.finalAmount).toBe(1126825);
  });

  it('should calculate quarterly compounding', () => {
    const result = calculateCompoundInterest({
      principal: 1000000,
      annualRate: 8,
      years: 1,
      frequency: 'quarterly',
      monthlyContribution: 0,
    });
    // Quarterly rate = 2%, compounded 4 times
    // 1000000 * (1.02)^4 = 1082432.16
    expect(result.finalAmount).toBe(1082432);
  });

  it('should handle monthly contributions', () => {
    const result = calculateCompoundInterest({
      principal: 0,
      annualRate: 0,
      years: 1,
      frequency: 'monthly',
      monthlyContribution: 10000,
    });
    // 12 months * 10000 = 120000 (no interest)
    expect(result.totalContributions).toBe(120000);
    expect(result.finalAmount).toBe(120000);
    expect(result.totalInterest).toBe(0);
  });

  it('should handle principal with monthly contributions and interest', () => {
    const result = calculateCompoundInterest({
      principal: 100000,
      annualRate: 12,
      years: 1,
      frequency: 'monthly',
      monthlyContribution: 10000,
    });
    // Total contributions = 100000 + 12 * 10000 = 220000
    expect(result.totalContributions).toBe(220000);
    expect(result.finalAmount).toBeGreaterThan(220000);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it('should have correct yearly snapshots', () => {
    const result = calculateCompoundInterest({
      principal: 1000000,
      annualRate: 5,
      years: 3,
      frequency: 'yearly',
      monthlyContribution: 0,
    });
    expect(result.yearlySnapshots).toHaveLength(3);
    expect(result.yearlySnapshots[0].year).toBe(1);
    expect(result.yearlySnapshots[0].balance).toBe(1050000);
    expect(result.yearlySnapshots[1].year).toBe(2);
    expect(result.yearlySnapshots[1].balance).toBe(1102500);
    expect(result.yearlySnapshots[2].year).toBe(3);
    expect(result.yearlySnapshots[2].balance).toBe(1157625);
  });

  it('should handle zero interest rate', () => {
    const result = calculateCompoundInterest({
      principal: 500000,
      annualRate: 0,
      years: 5,
      frequency: 'monthly',
      monthlyContribution: 10000,
    });
    expect(result.totalContributions).toBe(1100000); // 500000 + 60 * 10000
    expect(result.finalAmount).toBe(1100000);
    expect(result.totalInterest).toBe(0);
  });

  it('should throw for negative principal', () => {
    expect(() =>
      calculateCompoundInterest({
        principal: -1,
        annualRate: 5,
        years: 1,
        frequency: 'yearly',
        monthlyContribution: 0,
      }),
    ).toThrow('Principal must be non-negative');
  });

  it('should throw for negative rate', () => {
    expect(() =>
      calculateCompoundInterest({
        principal: 1000,
        annualRate: -5,
        years: 1,
        frequency: 'yearly',
        monthlyContribution: 0,
      }),
    ).toThrow('Annual rate must be non-negative');
  });

  it('should throw for zero years', () => {
    expect(() =>
      calculateCompoundInterest({
        principal: 1000,
        annualRate: 5,
        years: 0,
        frequency: 'yearly',
        monthlyContribution: 0,
      }),
    ).toThrow('Years must be positive');
  });

  it('should throw for negative monthly contribution', () => {
    expect(() =>
      calculateCompoundInterest({
        principal: 1000,
        annualRate: 5,
        years: 1,
        frequency: 'yearly',
        monthlyContribution: -100,
      }),
    ).toThrow('Monthly contribution must be non-negative');
  });
});
