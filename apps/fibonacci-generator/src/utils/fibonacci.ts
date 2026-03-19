export function generate(count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [0];

  const seq: number[] = [0, 1];
  for (let i = 2; i < count; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq;
}

export function nthFib(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error('N must be a non-negative integer');
  }
  if (n === 0) return 0;
  if (n === 1) return 1;

  let a = 0;
  let b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

export function isFibonacci(n: number): boolean {
  if (n < 0) return false;
  if (n === 0 || n === 1) return true;
  // A number is Fibonacci if 5n^2+4 or 5n^2-4 is a perfect square
  return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);
}

function isPerfectSquare(n: number): boolean {
  if (n < 0) return false;
  const s = Math.round(Math.sqrt(n));
  return s * s === n;
}

export function goldenRatioApproximations(count: number): { n: number; ratio: number }[] {
  const seq = generate(Math.max(count + 2, 3));
  const ratios: { n: number; ratio: number }[] = [];

  for (let i = 2; i < seq.length && ratios.length < count; i++) {
    if (seq[i - 1] !== 0) {
      ratios.push({
        n: i,
        ratio: seq[i] / seq[i - 1],
      });
    }
  }
  return ratios;
}

export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

// Aliases for backward compatibility
export const generateSequence = generate;
export const nthFibonacci = nthFib;

export function goldenRatioApprox(n: number): number {
  if (n <= 1) return NaN;
  return nthFib(n) / nthFib(n - 1);
}

export function fibonacciIndex(n: number): number | null {
  if (!isFibonacci(n)) return null;
  if (n === 0) return 0;
  if (n === 1) return 1;

  let a = 0;
  let b = 1;
  let idx = 1;
  while (b < n) {
    const temp = a + b;
    a = b;
    b = temp;
    idx++;
  }
  return b === n ? idx : null;
}
