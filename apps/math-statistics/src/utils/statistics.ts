export interface StatsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  variance: number;
  stdDev: number;
}

export function parseNumbers(input: string): number[] {
  return input
    .split(/[,\s\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

export function calculateStats(numbers: number[]): StatsResult | null {
  if (numbers.length === 0) return null;

  const sorted = [...numbers].sort((a, b) => a - b);
  const count = numbers.length;
  const sum = numbers.reduce((a, b) => a + b, 0);
  const mean = sum / count;
  const min = sorted[0];
  const max = sorted[count - 1];
  const range = max - min;

  let median: number;
  if (count % 2 === 0) {
    median = (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
  } else {
    median = sorted[Math.floor(count / 2)];
  }

  const freqMap = new Map<number, number>();
  for (const n of numbers) {
    freqMap.set(n, (freqMap.get(n) ?? 0) + 1);
  }
  const maxFreq = Math.max(...freqMap.values());
  const mode =
    maxFreq > 1 ? [...freqMap.entries()].filter(([_, f]) => f === maxFreq).map(([v]) => v) : [];

  const variance = numbers.reduce((acc, n) => acc + (n - mean) ** 2, 0) / count;
  const stdDev = Math.sqrt(variance);

  return { count, sum, mean, median, mode, min, max, range, variance, stdDev };
}
