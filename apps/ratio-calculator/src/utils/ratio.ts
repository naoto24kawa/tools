export type RatioKey = "golden" | "silver" | "platinum" | "bronze";

export interface RatioDef {
  key: RatioKey;
  label: string;
  englishLabel: string;
  value: number;
}

export const RATIOS: readonly RatioDef[] = [
  { key: "golden", label: "黄金比", englishLabel: "Golden", value: (1 + Math.sqrt(5)) / 2 },
  { key: "silver", label: "白銀比", englishLabel: "Silver", value: 1 + Math.sqrt(2) },
  { key: "platinum", label: "白金比", englishLabel: "Platinum", value: Math.sqrt(3) },
  { key: "bronze", label: "青銅比", englishLabel: "Bronze", value: (3 + Math.sqrt(13)) / 2 },
];

export function getRatio(key: RatioKey): RatioDef {
  const found = RATIOS.find((r) => r.key === key);
  if (!found) throw new Error(`Unknown ratio key: ${key}`);
  return found;
}

function isPositiveFinite(n: number): boolean {
  return Number.isFinite(n) && n > 0;
}

export function split(total: number, ratio: number): { long: number; short: number } {
  if (!isPositiveFinite(total) || !isPositiveFinite(ratio)) {
    return { long: 0, short: 0 };
  }
  const long = total / ratio;
  return { long, short: total - long };
}

export function scale(value: number, ratio: number): { larger: number; smaller: number } {
  if (!isPositiveFinite(value) || !isPositiveFinite(ratio)) {
    return { larger: 0, smaller: 0 };
  }
  return { larger: value * ratio, smaller: value / ratio };
}

const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 });

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "-";
  return numberFormatter.format(n);
}
