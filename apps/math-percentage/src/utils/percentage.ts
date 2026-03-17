export function whatPercent(part: number, whole: number): number {
  if (whole === 0) return 0;
  return (part / whole) * 100;
}

export function percentOf(percent: number, whole: number): number {
  return (percent / 100) * whole;
}

export function percentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

export function addPercent(value: number, percent: number): number {
  return value * (1 + percent / 100);
}

export function subtractPercent(value: number, percent: number): number {
  return value * (1 - percent / 100);
}
