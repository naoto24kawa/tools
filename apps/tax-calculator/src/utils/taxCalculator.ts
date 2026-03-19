export type TaxRate = 0.1 | 0.08;

export interface TaxResult {
  /** Tax-exclusive amount */
  exclusive: number;
  /** Tax-inclusive amount */
  inclusive: number;
  /** Tax amount */
  tax: number;
  /** Tax rate used */
  rate: TaxRate;
}

export interface BatchItem {
  name: string;
  amount: number;
  rate: TaxRate;
  isInclusive: boolean;
}

export interface BatchResult {
  items: (BatchItem & TaxResult)[];
  totalExclusive: number;
  totalInclusive: number;
  totalTax: number;
}

/**
 * Calculate tax-inclusive amount from tax-exclusive amount.
 */
export function toInclusive(amount: number, rate: TaxRate): TaxResult {
  const tax = Math.floor(amount * rate);
  return {
    exclusive: amount,
    inclusive: amount + tax,
    tax,
    rate,
  };
}

/**
 * Calculate tax-exclusive amount from tax-inclusive amount.
 */
export function toExclusive(amount: number, rate: TaxRate): TaxResult {
  const exclusive = Math.ceil(amount / (1 + rate));
  const tax = amount - exclusive;
  return {
    exclusive,
    inclusive: amount,
    tax,
    rate,
  };
}

/**
 * Calculate tax from an amount given direction.
 */
export function calculateTax(
  amount: number,
  rate: TaxRate,
  isInclusive: boolean,
): TaxResult {
  if (amount < 0) {
    throw new Error('Amount must be non-negative');
  }
  return isInclusive ? toExclusive(amount, rate) : toInclusive(amount, rate);
}

/**
 * Calculate tax for multiple items at once.
 */
export function calculateBatch(items: BatchItem[]): BatchResult {
  const results = items.map((item) => {
    const result = calculateTax(item.amount, item.rate, item.isInclusive);
    return { ...item, ...result };
  });

  return {
    items: results,
    totalExclusive: results.reduce((sum, r) => sum + r.exclusive, 0),
    totalInclusive: results.reduce((sum, r) => sum + r.inclusive, 0),
    totalTax: results.reduce((sum, r) => sum + r.tax, 0),
  };
}
