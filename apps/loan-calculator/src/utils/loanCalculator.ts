export interface LoanInput {
  /** Principal amount */
  principal: number;
  /** Annual interest rate (e.g. 3.5 for 3.5%) */
  annualRate: number;
  /** Total number of months */
  totalMonths: number;
}

export interface MonthlyPayment {
  month: number;
  payment: number;
  principalPart: number;
  interestPart: number;
  remainingBalance: number;
}

export interface LoanResult {
  schedule: MonthlyPayment[];
  totalPayment: number;
  totalInterest: number;
  monthlyPaymentFirst: number;
}

/**
 * Equal payment (元利均等返済) - same total monthly payment throughout.
 */
export function calculateEqualPayment(input: LoanInput): LoanResult {
  const { principal, annualRate, totalMonths } = input;

  if (principal <= 0) throw new Error('Principal must be positive');
  if (totalMonths <= 0) throw new Error('Term must be positive');
  if (annualRate < 0) throw new Error('Interest rate must be non-negative');

  const monthlyRate = annualRate / 100 / 12;
  const schedule: MonthlyPayment[] = [];

  if (monthlyRate === 0) {
    const payment = Math.round(principal / totalMonths);
    let remaining = principal;
    for (let m = 1; m <= totalMonths; m++) {
      const p = m === totalMonths ? remaining : payment;
      remaining -= p;
      schedule.push({
        month: m,
        payment: p,
        principalPart: p,
        interestPart: 0,
        remainingBalance: Math.max(remaining, 0),
      });
    }
    return {
      schedule,
      totalPayment: principal,
      totalInterest: 0,
      monthlyPaymentFirst: payment,
    };
  }

  // Monthly payment formula: M = P * r * (1+r)^n / ((1+r)^n - 1)
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const monthlyPayment = Math.round(
    (principal * monthlyRate * factor) / (factor - 1),
  );

  let remaining = principal;
  let totalPaid = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const interestPart = Math.round(remaining * monthlyRate);
    let payment: number;
    let principalPart: number;

    if (m === totalMonths) {
      principalPart = remaining;
      payment = principalPart + interestPart;
    } else {
      payment = monthlyPayment;
      principalPart = payment - interestPart;
    }

    remaining -= principalPart;
    totalPaid += payment;

    schedule.push({
      month: m,
      payment,
      principalPart,
      interestPart,
      remainingBalance: Math.max(remaining, 0),
    });
  }

  return {
    schedule,
    totalPayment: totalPaid,
    totalInterest: totalPaid - principal,
    monthlyPaymentFirst: monthlyPayment,
  };
}

/**
 * Equal principal (元金均等返済) - same principal portion each month.
 */
export function calculateEqualPrincipal(input: LoanInput): LoanResult {
  const { principal, annualRate, totalMonths } = input;

  if (principal <= 0) throw new Error('Principal must be positive');
  if (totalMonths <= 0) throw new Error('Term must be positive');
  if (annualRate < 0) throw new Error('Interest rate must be non-negative');

  const monthlyRate = annualRate / 100 / 12;
  const principalPart = Math.round(principal / totalMonths);
  const schedule: MonthlyPayment[] = [];
  let remaining = principal;
  let totalPaid = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const interestPart = Math.round(remaining * monthlyRate);
    const actualPrincipal = m === totalMonths ? remaining : principalPart;
    const payment = actualPrincipal + interestPart;

    remaining -= actualPrincipal;
    totalPaid += payment;

    schedule.push({
      month: m,
      payment,
      principalPart: actualPrincipal,
      interestPart,
      remainingBalance: Math.max(remaining, 0),
    });
  }

  return {
    schedule,
    totalPayment: totalPaid,
    totalInterest: totalPaid - principal,
    monthlyPaymentFirst: schedule[0].payment,
  };
}
