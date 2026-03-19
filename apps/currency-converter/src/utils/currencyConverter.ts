export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'JPY', name: '日本円', symbol: '¥' },
  { code: 'USD', name: '米ドル', symbol: '$' },
  { code: 'EUR', name: 'ユーロ', symbol: '€' },
  { code: 'GBP', name: '英ポンド', symbol: '£' },
  { code: 'CNY', name: '中国元', symbol: '¥' },
  { code: 'KRW', name: '韓国ウォン', symbol: '₩' },
  { code: 'AUD', name: '豪ドル', symbol: 'A$' },
  { code: 'CAD', name: 'カナダドル', symbol: 'C$' },
  { code: 'CHF', name: 'スイスフラン', symbol: 'CHF' },
  { code: 'HKD', name: '香港ドル', symbol: 'HK$' },
  { code: 'SGD', name: 'シンガポールドル', symbol: 'S$' },
  { code: 'TWD', name: '台湾ドル', symbol: 'NT$' },
  { code: 'THB', name: 'タイバーツ', symbol: '฿' },
  { code: 'INR', name: 'インドルピー', symbol: '₹' },
  { code: 'NZD', name: 'ニュージーランドドル', symbol: 'NZ$' },
];

/**
 * Default exchange rates (base: JPY).
 * These are approximate rates and should be updated by the user.
 * Rate means: 1 unit of currency = X JPY.
 */
export const DEFAULT_RATES: Record<string, number> = {
  JPY: 1,
  USD: 150.0,
  EUR: 163.0,
  GBP: 190.0,
  CNY: 21.0,
  KRW: 0.11,
  AUD: 97.0,
  CAD: 110.0,
  CHF: 170.0,
  HKD: 19.2,
  SGD: 112.0,
  TWD: 4.7,
  THB: 4.3,
  INR: 1.8,
  NZD: 89.0,
};

export interface ConversionResult {
  fromCode: string;
  toCode: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  inverseRate: number;
}

/**
 * Convert between currencies using rates (base: JPY).
 */
export function convert(
  amount: number,
  fromCode: string,
  toCode: string,
  rates: Record<string, number>,
): ConversionResult {
  if (amount < 0) throw new Error('Amount must be non-negative');

  const fromRate = rates[fromCode];
  const toRate = rates[toCode];

  if (fromRate === undefined) throw new Error(`Unknown currency: ${fromCode}`);
  if (toRate === undefined) throw new Error(`Unknown currency: ${toCode}`);
  if (fromRate <= 0 || toRate <= 0) throw new Error('Rates must be positive');

  // Convert: amount in fromCurrency -> JPY -> toCurrency
  const jpyAmount = amount * fromRate;
  const toAmount = jpyAmount / toRate;

  // Direct rate: 1 fromCurrency = X toCurrency
  const rate = fromRate / toRate;
  const inverseRate = toRate / fromRate;

  return {
    fromCode,
    toCode,
    fromAmount: amount,
    toAmount: Math.round(toAmount * 10000) / 10000, // 4 decimal places
    rate: Math.round(rate * 10000) / 10000,
    inverseRate: Math.round(inverseRate * 10000) / 10000,
  };
}

/**
 * Format a currency amount with appropriate decimal places.
 */
export function formatAmount(amount: number, currencyCode: string): string {
  const noDecimalCurrencies = ['JPY', 'KRW', 'TWD'];
  const decimals = noDecimalCurrencies.includes(currencyCode) ? 0 : 2;
  return amount.toLocaleString('ja-JP', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
