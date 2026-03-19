export type CompoundingFrequency = 'monthly' | 'quarterly' | 'yearly';

export interface CompoundInput {
  principal: number;
  annualRate: number; // e.g. 5 for 5%
  years: number;
  frequency: CompoundingFrequency;
  monthlyContribution: number;
}

export interface YearlySnapshot {
  year: number;
  balance: number;
  totalContributions: number;
  totalInterest: number;
}

export interface CompoundResult {
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
  yearlySnapshots: YearlySnapshot[];
}

function getPeriodsPerYear(frequency: CompoundingFrequency): number {
  switch (frequency) {
    case 'monthly':
      return 12;
    case 'quarterly':
      return 4;
    case 'yearly':
      return 1;
  }
}

/**
 * Calculate compound interest with optional monthly contributions.
 */
export function calculateCompoundInterest(input: CompoundInput): CompoundResult {
  const { principal, annualRate, years, frequency, monthlyContribution } = input;

  if (principal < 0) throw new Error('Principal must be non-negative');
  if (annualRate < 0) throw new Error('Annual rate must be non-negative');
  if (years <= 0) throw new Error('Years must be positive');
  if (monthlyContribution < 0) {
    throw new Error('Monthly contribution must be non-negative');
  }

  const periodsPerYear = getPeriodsPerYear(frequency);
  const ratePerPeriod = annualRate / 100 / periodsPerYear;
  const monthsPerPeriod = 12 / periodsPerYear;

  let balance = principal;
  let totalContributions = principal;
  const yearlySnapshots: YearlySnapshot[] = [];

  for (let year = 1; year <= years; year++) {
    for (let p = 0; p < periodsPerYear; p++) {
      // Add monthly contributions for this period
      balance += monthlyContribution * monthsPerPeriod;
      totalContributions += monthlyContribution * monthsPerPeriod;

      // Apply interest
      balance += balance * ratePerPeriod;
    }

    yearlySnapshots.push({
      year,
      balance: Math.round(balance),
      totalContributions: Math.round(totalContributions),
      totalInterest: Math.round(balance - totalContributions),
    });
  }

  const finalAmount = Math.round(balance);
  const totalInterest = Math.round(balance - totalContributions);

  return {
    finalAmount,
    totalContributions: Math.round(totalContributions),
    totalInterest,
    yearlySnapshots,
  };
}
