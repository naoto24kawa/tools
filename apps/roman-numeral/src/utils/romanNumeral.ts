const ROMAN_MAP: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

const ROMAN_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

const ROMAN_REGEX = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

export function toRoman(num: number): string {
  if (!Number.isInteger(num) || num < 1 || num > 3999) {
    throw new Error('Number must be an integer between 1 and 3999');
  }

  let result = '';
  let remaining = num;
  for (const [value, symbol] of ROMAN_MAP) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}

export function toArabic(roman: string): number {
  const upper = roman.trim().toUpperCase();
  if (!upper) {
    throw new Error('Input cannot be empty');
  }

  if (!isValidRoman(upper)) {
    throw new Error('Invalid Roman numeral');
  }

  let result = 0;
  for (let i = 0; i < upper.length; i++) {
    const current = ROMAN_VALUES[upper[i]];
    const next = i + 1 < upper.length ? ROMAN_VALUES[upper[i + 1]] : 0;

    if (current < next) {
      result -= current;
    } else {
      result += current;
    }
  }

  // Verify by converting back
  if (result < 1 || result > 3999 || toRoman(result) !== upper) {
    throw new Error('Invalid Roman numeral');
  }

  return result;
}

export function isValidRoman(input: string): boolean {
  const upper = input.toUpperCase().trim();
  return upper.length > 0 && ROMAN_REGEX.test(upper);
}

export function isRomanInput(input: string): boolean {
  return /^[IVXLCDMivxlcdm]+$/.test(input.trim());
}

export function isValidArabic(num: number): boolean {
  return Number.isInteger(num) && num >= 1 && num <= 3999;
}

export const REFERENCE_TABLE: [number, string][] = [
  [1, 'I'],
  [4, 'IV'],
  [5, 'V'],
  [9, 'IX'],
  [10, 'X'],
  [40, 'XL'],
  [50, 'L'],
  [90, 'XC'],
  [100, 'C'],
  [400, 'CD'],
  [500, 'D'],
  [900, 'CM'],
  [1000, 'M'],
];
