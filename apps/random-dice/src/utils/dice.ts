export interface DiceResult {
  values: number[];
  total: number;
  min: number;
  max: number;
  average: number;
}

function secureRandom(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % max) + 1;
}

export function rollDice(sides: number, count: number): DiceResult {
  const values = Array.from({ length: count }, () => secureRandom(sides));
  const total = values.reduce((sum, v) => sum + v, 0);
  return {
    values,
    total,
    min: Math.min(...values),
    max: Math.max(...values),
    average: total / count,
  };
}

export const COMMON_DICE = [4, 6, 8, 10, 12, 20, 100] as const;
