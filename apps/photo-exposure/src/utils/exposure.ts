// EV = log2(f² / t) + log2(ISO / 100)
// EV = log2(f² × ISO / (100 × t))

export const STANDARD_F_NUMBERS = [1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32];
export const STANDARD_SHUTTER_SPEEDS = [
  30, 15, 8, 4, 2, 1,
  1 / 2, 1 / 4, 1 / 8, 1 / 15, 1 / 30, 1 / 60,
  1 / 125, 1 / 250, 1 / 500, 1 / 1000, 1 / 2000, 1 / 4000,
];
export const STANDARD_ISO_VALUES = [50, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];

function assertPositive(value: number, name: string) {
  if (value <= 0) throw new Error(`${name} must be positive`);
}

/** EV値を算出 */
export function calcEV(fNumber: number, shutterSpeed: number, iso: number): number {
  assertPositive(fNumber, 'f-number');
  assertPositive(shutterSpeed, 'Shutter speed');
  assertPositive(iso, 'ISO');
  return Math.log2((fNumber * fNumber * iso) / (100 * shutterSpeed));
}

/** シャッタースピードを算出 */
export function calcShutterSpeed(ev: number, fNumber: number, iso: number): number {
  assertPositive(fNumber, 'f-number');
  assertPositive(iso, 'ISO');
  return (fNumber * fNumber * iso) / (100 * Math.pow(2, ev));
}

/** f値を算出 */
export function calcFNumber(ev: number, shutterSpeed: number, iso: number): number {
  assertPositive(shutterSpeed, 'Shutter speed');
  assertPositive(iso, 'ISO');
  return Math.sqrt((100 * shutterSpeed * Math.pow(2, ev)) / iso);
}

/** ISO感度を算出 */
export function calcISO(ev: number, fNumber: number, shutterSpeed: number): number {
  assertPositive(fNumber, 'f-number');
  assertPositive(shutterSpeed, 'Shutter speed');
  return (100 * shutterSpeed * Math.pow(2, ev)) / (fNumber * fNumber);
}

/** シャッタースピードを人間が読める文字列に変換 (例: 0.008 → "1/125s") */
export function formatShutterSpeed(ss: number): string {
  if (ss >= 1) return `${ss}s`;
  const denom = Math.round(1 / ss);
  return `1/${denom}s`;
}
