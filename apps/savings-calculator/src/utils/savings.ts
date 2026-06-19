export interface SavingsParams {
  monthlyAmount: number;
  years: number;
  annualRate: number;
  initialAmount?: number;
}

export interface YearlyEntry {
  year: number;
  balance: number;
  totalPrincipal: number;
  totalInterest: number;
}

export interface SavingsResult {
  total: number;
  principal: number;
  interest: number;
  yearlyBreakdown: YearlyEntry[];
}

export function calcSavings(params: SavingsParams): SavingsResult {
  const { monthlyAmount, years, annualRate, initialAmount = 0 } = params;
  if (monthlyAmount < 0) throw new Error('Monthly amount must be non-negative');
  if (years <= 0) throw new Error('Years must be positive');
  if (annualRate < 0) throw new Error('Annual rate must be non-negative');

  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  let balance = initialAmount;
  const yearlyBreakdown: YearlyEntry[] = [];
  let totalPrincipal = initialAmount;

  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + monthlyRate) + monthlyAmount;
    totalPrincipal += monthlyAmount;

    if (m % 12 === 0) {
      yearlyBreakdown.push({
        year: m / 12,
        balance,
        totalPrincipal,
        totalInterest: balance - totalPrincipal,
      });
    }
  }

  return {
    total: balance,
    principal: totalPrincipal,
    interest: balance - totalPrincipal,
    yearlyBreakdown,
  };
}

export function calcRequiredMonthly(
  target: number,
  years: number,
  annualRate: number,
): number {
  if (target <= 0) throw new Error('Target must be positive');
  if (years <= 0) throw new Error('Years must be positive');
  if (annualRate < 0) throw new Error('Annual rate must be non-negative');

  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  if (monthlyRate === 0) return target / months;

  // FV = PMT × ((1+r)^n - 1) / r → PMT = FV × r / ((1+r)^n - 1)
  return (target * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
}
