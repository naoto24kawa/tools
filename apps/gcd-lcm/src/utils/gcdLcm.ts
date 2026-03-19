export interface GcdStep {
  a: number;
  b: number;
  quotient: number;
  remainder: number;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

export function gcdSteps(a: number, b: number): GcdStep[] {
  const steps: GcdStep[] = [];
  a = Math.abs(a);
  b = Math.abs(b);

  // Ensure a >= b
  if (a < b) {
    [a, b] = [b, a];
  }

  while (b !== 0) {
    const quotient = Math.floor(a / b);
    const remainder = a % b;
    steps.push({ a, b, quotient, remainder });
    a = b;
    b = remainder;
  }

  return steps;
}

export function gcdMultiple(numbers: number[]): number {
  if (numbers.length === 0) throw new Error('At least one number is required');
  if (numbers.length === 1) return Math.abs(numbers[0]);
  return numbers.reduce((acc, n) => gcd(acc, n));
}

export function lcmMultiple(numbers: number[]): number {
  if (numbers.length === 0) throw new Error('At least one number is required');
  if (numbers.length === 1) return Math.abs(numbers[0]);
  return numbers.reduce((acc, n) => lcm(acc, n));
}

export interface PrimeFactorEntry {
  factor: number;
  exponent: number;
}

export function primeFactorize(n: number): PrimeFactorEntry[] {
  if (n < 2) return [];
  const factors: PrimeFactorEntry[] = [];
  let remaining = Math.abs(n);

  for (let d = 2; d * d <= remaining; d++) {
    if (remaining % d === 0) {
      let exp = 0;
      while (remaining % d === 0) {
        exp++;
        remaining /= d;
      }
      factors.push({ factor: d, exponent: exp });
    }
  }
  if (remaining > 1) {
    factors.push({ factor: remaining, exponent: 1 });
  }
  return factors;
}

export function parseNumbers(input: string): number[] {
  const parts = input
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const numbers = parts.map((s) => {
    const n = Number(s);
    if (isNaN(n) || !Number.isInteger(n) || n <= 0) {
      throw new Error(`Invalid number: "${s}". Please enter positive integers.`);
    }
    return n;
  });
  if (numbers.length < 2) {
    throw new Error('Please enter at least 2 numbers separated by commas');
  }
  return numbers;
}
