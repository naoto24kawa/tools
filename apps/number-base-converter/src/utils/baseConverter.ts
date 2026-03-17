const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

export function convertBase(value: string, fromBase: number, toBase: number): string {
  if (value.trim() === '') return '';
  if (fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
    throw new Error('Base must be between 2 and 36');
  }

  const isNegative = value.startsWith('-');
  const absValue = isNegative ? value.slice(1) : value;
  const normalized = absValue.toLowerCase().trim();

  let decimal = 0n;
  for (const char of normalized) {
    const digitValue = DIGITS.indexOf(char);
    if (digitValue === -1 || digitValue >= fromBase) {
      throw new Error(`Invalid digit '${char}' for base ${fromBase}`);
    }
    decimal = decimal * BigInt(fromBase) + BigInt(digitValue);
  }

  if (decimal === 0n) return '0';

  let result = '';
  let remaining = decimal;
  while (remaining > 0n) {
    const remainder = Number(remaining % BigInt(toBase));
    result = DIGITS[remainder] + result;
    remaining = remaining / BigInt(toBase);
  }

  return isNegative ? `-${result}` : result;
}

export const COMMON_BASES = [
  { value: 2, label: '2 (Binary)' },
  { value: 8, label: '8 (Octal)' },
  { value: 10, label: '10 (Decimal)' },
  { value: 16, label: '16 (Hex)' },
  { value: 36, label: '36 (Base36)' },
] as const;
