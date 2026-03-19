export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  if (n === 3) return true;
  if (n % 3 === 0) return false;

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export interface PrimeFactor {
  factor: number;
  exponent: number;
}

export function factorize(n: number): PrimeFactor[] {
  if (!Number.isInteger(n) || n < 2) {
    throw new Error('Number must be an integer >= 2');
  }

  const factors: PrimeFactor[] = [];
  let remaining = n;

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

export function formatFactorization(factors: PrimeFactor[]): string {
  return factors
    .map((f) => (f.exponent === 1 ? String(f.factor) : `${f.factor}^${f.exponent}`))
    .join(' * ');
}

export function sieve(limit: number): number[] {
  if (limit < 2) return [];

  const isComposite = new Uint8Array(limit + 1);
  const primes: number[] = [];

  for (let i = 2; i <= limit; i++) {
    if (!isComposite[i]) {
      primes.push(i);
      if (i * i <= limit) {
        for (let j = i * i; j <= limit; j += i) {
          isComposite[j] = 1;
        }
      }
    }
  }

  return primes;
}

export function sieveRange(start: number, end: number): number[] {
  if (start > end) return [];
  const all = sieve(end);
  return all.filter((p) => p >= start);
}

export function nthPrime(n: number): number {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error('N must be a positive integer');
  }

  if (n === 1) return 2;

  // Upper bound estimate for nth prime: n * (ln(n) + ln(ln(n))) for n >= 6
  let limit = n < 6 ? 15 : Math.ceil(n * (Math.log(n) + Math.log(Math.log(n)))) + 10;
  let primes = sieve(limit);

  while (primes.length < n) {
    limit = Math.ceil(limit * 1.5);
    primes = sieve(limit);
  }

  return primes[n - 1];
}
