export interface AspectRatio {
  width: number;
  height: number;
  ratioWidth: number;
  ratioHeight: number;
  decimal: number;
}

export interface Preset {
  label: string;
  ratioWidth: number;
  ratioHeight: number;
}

export const PRESETS: Preset[] = [
  { label: '16:9 (Widescreen)', ratioWidth: 16, ratioHeight: 9 },
  { label: '4:3 (Standard)', ratioWidth: 4, ratioHeight: 3 },
  { label: '1:1 (Square)', ratioWidth: 1, ratioHeight: 1 },
  { label: '21:9 (Ultra-wide)', ratioWidth: 21, ratioHeight: 9 },
  { label: '9:16 (Vertical)', ratioWidth: 9, ratioHeight: 16 },
  { label: '3:2 (Photo)', ratioWidth: 3, ratioHeight: 2 },
  { label: '2:1 (Univisium)', ratioWidth: 2, ratioHeight: 1 },
  { label: '5:4 (Monitor)', ratioWidth: 5, ratioHeight: 4 },
];

function gcd(a: number, b: number): number {
  const absA = Math.abs(Math.round(a));
  const absB = Math.abs(Math.round(b));
  if (absB === 0) return absA;
  return gcd(absB, absA % absB);
}

export function calculate(width: number, height: number): AspectRatio {
  if (width <= 0 || height <= 0) {
    return { width, height, ratioWidth: 0, ratioHeight: 0, decimal: 0 };
  }

  const divisor = gcd(width, height);
  return {
    width,
    height,
    ratioWidth: width / divisor,
    ratioHeight: height / divisor,
    decimal: width / height,
  };
}

export function fromRatio(
  ratioWidth: number,
  ratioHeight: number,
  knownDimension: 'width' | 'height',
  knownValue: number
): { width: number; height: number } {
  if (ratioWidth <= 0 || ratioHeight <= 0 || knownValue <= 0) {
    return { width: 0, height: 0 };
  }

  if (knownDimension === 'width') {
    const height = Math.round((knownValue * ratioHeight) / ratioWidth);
    return { width: knownValue, height };
  } else {
    const width = Math.round((knownValue * ratioWidth) / ratioHeight);
    return { width, height: knownValue };
  }
}

export function formatRatio(ratioWidth: number, ratioHeight: number): string {
  if (ratioWidth <= 0 || ratioHeight <= 0) return '-';
  return `${ratioWidth}:${ratioHeight}`;
}

export function formatDecimal(decimal: number): string {
  if (decimal <= 0 || !isFinite(decimal)) return '-';
  return decimal.toFixed(4);
}
