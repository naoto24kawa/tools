export type RoundingMode = 'up' | 'down' | 'nearest';

export interface TipInput {
  billAmount: number;
  tipPercent: number;
  numPeople: number;
  rounding: RoundingMode;
}

export interface TipResult {
  billAmount: number;
  tipAmount: number;
  totalAmount: number;
  tipPercent: number;
  numPeople: number;
  perPersonBill: number;
  perPersonTip: number;
  perPersonTotal: number;
}

function applyRounding(value: number, mode: RoundingMode): number {
  switch (mode) {
    case 'up':
      return Math.ceil(value);
    case 'down':
      return Math.floor(value);
    case 'nearest':
      return Math.round(value);
  }
}

/**
 * Calculate tip and split amounts.
 */
export function calculateTip(input: TipInput): TipResult {
  const { billAmount, tipPercent, numPeople, rounding } = input;

  if (billAmount < 0) throw new Error('Bill amount must be non-negative');
  if (tipPercent < 0) throw new Error('Tip percent must be non-negative');
  if (numPeople < 1) throw new Error('Number of people must be at least 1');

  const tipAmount = applyRounding(billAmount * (tipPercent / 100), rounding);
  const totalAmount = billAmount + tipAmount;

  const perPersonTotal = applyRounding(totalAmount / numPeople, rounding);
  const perPersonBill = applyRounding(billAmount / numPeople, rounding);
  const perPersonTip = applyRounding(tipAmount / numPeople, rounding);

  return {
    billAmount,
    tipAmount,
    totalAmount,
    tipPercent,
    numPeople,
    perPersonBill,
    perPersonTip,
    perPersonTotal,
  };
}

/**
 * Calculate tips for multiple tip percentages for comparison.
 */
export function calculateTipComparison(
  billAmount: number,
  tipPercents: number[],
  numPeople: number,
  rounding: RoundingMode,
): TipResult[] {
  return tipPercents.map((tipPercent) =>
    calculateTip({ billAmount, tipPercent, numPeople, rounding }),
  );
}
