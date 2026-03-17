function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export interface Fraction {
  numerator: number;
  denominator: number;
}

export function simplify(num: number, den: number): Fraction {
  if (den === 0) return { numerator: num, denominator: 0 };
  const sign = num < 0 !== den < 0 ? -1 : 1;
  const absNum = Math.abs(num);
  const absDen = Math.abs(den);
  const g = gcd(absNum, absDen);
  return { numerator: sign * (absNum / g), denominator: absDen / g };
}

export function decimalToFraction(decimal: number): Fraction {
  if (Number.isInteger(decimal)) return { numerator: decimal, denominator: 1 };
  const str = String(decimal);
  const decimalPlaces = str.split('.')[1]?.length ?? 0;
  const denominator = 10 ** decimalPlaces;
  const numerator = Math.round(decimal * denominator);
  return simplify(numerator, denominator);
}

export function fractionToDecimal(num: number, den: number): number {
  if (den === 0) return Number.NaN;
  return num / den;
}

export function addFractions(a: Fraction, b: Fraction): Fraction {
  const num = a.numerator * b.denominator + b.numerator * a.denominator;
  const den = a.denominator * b.denominator;
  return simplify(num, den);
}

export function multiplyFractions(a: Fraction, b: Fraction): Fraction {
  return simplify(a.numerator * b.numerator, a.denominator * b.denominator);
}

export function formatFraction(f: Fraction): string {
  if (f.denominator === 0) return 'undefined';
  if (f.denominator === 1) return String(f.numerator);
  return `${f.numerator}/${f.denominator}`;
}
