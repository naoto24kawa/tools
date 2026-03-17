export interface RandomOptions {
  min: number;
  max: number;
  count: number;
  allowDuplicates: boolean;
  isFloat: boolean;
  decimalPlaces: number;
}

export const DEFAULT_OPTIONS: RandomOptions = {
  min: 1,
  max: 100,
  count: 10,
  allowDuplicates: true,
  isFloat: false,
  decimalPlaces: 2,
};

function secureRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % range);
}

function secureRandomFloat(min: number, max: number, decimals: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const ratio = array[0] / 0xffffffff;
  const value = min + ratio * (max - min);
  return Number(value.toFixed(decimals));
}

export function generateRandomNumbers(options: RandomOptions): number[] {
  const { min, max, count, allowDuplicates, isFloat, decimalPlaces } = options;
  if (min > max) return [];
  if (!allowDuplicates && !isFloat && count > max - min + 1) return [];

  const results: number[] = [];
  const seen = new Set<number>();

  while (results.length < count) {
    const num = isFloat ? secureRandomFloat(min, max, decimalPlaces) : secureRandomInt(min, max);
    if (!allowDuplicates && seen.has(num)) continue;
    seen.add(num);
    results.push(num);
  }

  return results;
}
