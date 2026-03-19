export type DiscountMode = 'percentage' | 'amount' | 'buyXgetY' | 'bundle';

export interface DiscountInput {
  originalPrice: number;
  mode: DiscountMode;
  /** Percentage off (e.g. 20 for 20% off). Used with 'percentage' mode. */
  percentageOff?: number;
  /** Amount off in yen. Used with 'amount' mode. */
  amountOff?: number;
  /** Buy X items. Used with 'buyXgetY' mode. */
  buyX?: number;
  /** Get Y items free. Used with 'buyXgetY' mode. */
  getY?: number;
  /** Total items being purchased. Used with 'buyXgetY' mode. */
  totalItems?: number;
  /** Bundle size. Used with 'bundle' mode. */
  bundleSize?: number;
  /** Bundle price for bundleSize items. Used with 'bundle' mode. */
  bundlePrice?: number;
  /** Number of items for bundle. Used with 'bundle' mode. */
  bundleItems?: number;
}

export interface DiscountResult {
  originalPrice: number;
  finalPrice: number;
  savingsAmount: number;
  savingsPercent: number;
  mode: DiscountMode;
  label: string;
}

/**
 * Calculate percentage discount.
 */
export function calculatePercentageOff(
  originalPrice: number,
  percentageOff: number,
): DiscountResult {
  if (originalPrice < 0) throw new Error('Price must be non-negative');
  if (percentageOff < 0 || percentageOff > 100) {
    throw new Error('Percentage must be between 0 and 100');
  }

  const savingsAmount = Math.floor(originalPrice * (percentageOff / 100));
  const finalPrice = originalPrice - savingsAmount;

  return {
    originalPrice,
    finalPrice,
    savingsAmount,
    savingsPercent: percentageOff,
    mode: 'percentage',
    label: `${percentageOff}% OFF`,
  };
}

/**
 * Calculate flat amount discount.
 */
export function calculateAmountOff(
  originalPrice: number,
  amountOff: number,
): DiscountResult {
  if (originalPrice < 0) throw new Error('Price must be non-negative');
  if (amountOff < 0) throw new Error('Discount amount must be non-negative');

  const savingsAmount = Math.min(amountOff, originalPrice);
  const finalPrice = originalPrice - savingsAmount;
  const savingsPercent =
    originalPrice > 0
      ? Math.round((savingsAmount / originalPrice) * 10000) / 100
      : 0;

  return {
    originalPrice,
    finalPrice,
    savingsAmount,
    savingsPercent,
    mode: 'amount',
    label: `${amountOff.toLocaleString()}円引き`,
  };
}

/**
 * Calculate buy X get Y free discount.
 */
export function calculateBuyXGetY(
  unitPrice: number,
  buyX: number,
  getY: number,
  totalItems: number,
): DiscountResult {
  if (unitPrice < 0) throw new Error('Price must be non-negative');
  if (buyX <= 0 || getY <= 0) throw new Error('Buy/Get values must be positive');
  if (totalItems <= 0) throw new Error('Total items must be positive');

  const groupSize = buyX + getY;
  const fullGroups = Math.floor(totalItems / groupSize);
  const remainder = totalItems % groupSize;
  const freeItems = fullGroups * getY;
  const paidItems = totalItems - freeItems;

  const originalPrice = totalItems * unitPrice;
  const finalPrice = paidItems * unitPrice;
  const savingsAmount = originalPrice - finalPrice;
  const savingsPercent =
    originalPrice > 0
      ? Math.round((savingsAmount / originalPrice) * 10000) / 100
      : 0;

  return {
    originalPrice,
    finalPrice,
    savingsAmount,
    savingsPercent,
    mode: 'buyXgetY',
    label: `${buyX}個買うと${getY}個無料 (${totalItems}個)`,
  };
}

/**
 * Calculate bundle pricing discount.
 */
export function calculateBundle(
  unitPrice: number,
  bundleSize: number,
  bundlePrice: number,
  totalItems: number,
): DiscountResult {
  if (unitPrice < 0) throw new Error('Price must be non-negative');
  if (bundleSize <= 0) throw new Error('Bundle size must be positive');
  if (bundlePrice < 0) throw new Error('Bundle price must be non-negative');
  if (totalItems <= 0) throw new Error('Total items must be positive');

  const originalPrice = totalItems * unitPrice;
  const fullBundles = Math.floor(totalItems / bundleSize);
  const remainder = totalItems % bundleSize;
  const finalPrice = fullBundles * bundlePrice + remainder * unitPrice;
  const savingsAmount = originalPrice - finalPrice;
  const savingsPercent =
    originalPrice > 0
      ? Math.round((savingsAmount / originalPrice) * 10000) / 100
      : 0;

  return {
    originalPrice,
    finalPrice,
    savingsAmount,
    savingsPercent,
    mode: 'bundle',
    label: `${bundleSize}個セット ${bundlePrice.toLocaleString()}円 (${totalItems}個)`,
  };
}

/**
 * Calculate discount based on input.
 */
export function calculateDiscount(input: DiscountInput): DiscountResult {
  switch (input.mode) {
    case 'percentage':
      return calculatePercentageOff(input.originalPrice, input.percentageOff ?? 0);
    case 'amount':
      return calculateAmountOff(input.originalPrice, input.amountOff ?? 0);
    case 'buyXgetY':
      return calculateBuyXGetY(
        input.originalPrice,
        input.buyX ?? 2,
        input.getY ?? 1,
        input.totalItems ?? 3,
      );
    case 'bundle':
      return calculateBundle(
        input.originalPrice,
        input.bundleSize ?? 3,
        input.bundlePrice ?? 0,
        input.bundleItems ?? 3,
      );
  }
}
