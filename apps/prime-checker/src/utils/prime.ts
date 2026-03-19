export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

export function factorize(n: number): number[] {
  if (!Number.isInteger(n) || n < 2) return [];
  const factors: number[] = [];
  let remaining = n;
  for (let i = 2; i * i <= remaining; i++) {
    while (remaining % i === 0) {
      factors.push(i);
      remaining /= i;
    }
  }
  if (remaining > 1) factors.push(remaining);
  return factors;
}

export function formatFactorization(factors: number[]): string {
  if (factors.length === 0) return '';
  const counts = new Map<number, number>();
  for (const f of factors) {
    counts.set(f, (counts.get(f) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([base, exp]) => (exp === 1 ? String(base) : `${base}^${exp}`))
    .join(' x ');
}

export function sieveOfEratosthenes(limit: number): number[] {
  if (limit < 2) return [];
  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = false;
  sieve[1] = false;
  for (let i = 2; i * i <= limit; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= limit; j += i) {
        sieve[j] = false;
      }
    }
  }
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    if (sieve[i]) primes.push(i);
  }
  return primes;
}

export function nthPrime(n: number): number {
  if (n < 1) throw new Error('n must be >= 1');
  if (n === 1) return 2;
  let count = 1;
  let candidate = 3;
  while (count < n) {
    if (isPrime(candidate)) count++;
    if (count < n) candidate += 2;
  }
  return candidate;
}
