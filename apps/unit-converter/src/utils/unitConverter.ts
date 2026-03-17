export interface UnitCategory {
  name: string;
  units: {
    id: string;
    label: string;
    toBase: (v: number) => number;
    fromBase: (v: number) => number;
  }[];
}

export const CATEGORIES: UnitCategory[] = [
  {
    name: '長さ',
    units: [
      { id: 'mm', label: 'ミリメートル (mm)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'cm', label: 'センチメートル (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'm', label: 'メートル (m)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', label: 'キロメートル (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'in', label: 'インチ (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { id: 'ft', label: 'フィート (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      {
        id: 'mi',
        label: 'マイル (mi)',
        toBase: (v) => v * 1609.344,
        fromBase: (v) => v / 1609.344,
      },
    ],
  },
  {
    name: '重さ',
    units: [
      {
        id: 'mg',
        label: 'ミリグラム (mg)',
        toBase: (v) => v / 1000000,
        fromBase: (v) => v * 1000000,
      },
      { id: 'g', label: 'グラム (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'kg', label: 'キログラム (kg)', toBase: (v) => v, fromBase: (v) => v },
      {
        id: 'lb',
        label: 'ポンド (lb)',
        toBase: (v) => v * 0.453592,
        fromBase: (v) => v / 0.453592,
      },
      {
        id: 'oz',
        label: 'オンス (oz)',
        toBase: (v) => v * 0.0283495,
        fromBase: (v) => v / 0.0283495,
      },
      { id: 't', label: 'トン (t)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    ],
  },
  {
    name: '温度',
    units: [
      { id: 'c', label: '摂氏 (C)', toBase: (v) => v, fromBase: (v) => v },
      {
        id: 'f',
        label: '華氏 (F)',
        toBase: (v) => (v - 32) * (5 / 9),
        fromBase: (v) => v * (9 / 5) + 32,
      },
      { id: 'k', label: 'ケルビン (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    name: '速度',
    units: [
      { id: 'mps', label: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kmh', label: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { id: 'mph', label: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { id: 'knot', label: 'knot', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    ],
  },
  {
    name: 'データ',
    units: [
      { id: 'b', label: 'バイト (B)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kb', label: 'キロバイト (KB)', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      {
        id: 'mb',
        label: 'メガバイト (MB)',
        toBase: (v) => v * 1048576,
        fromBase: (v) => v / 1048576,
      },
      {
        id: 'gb',
        label: 'ギガバイト (GB)',
        toBase: (v) => v * 1073741824,
        fromBase: (v) => v / 1073741824,
      },
      {
        id: 'tb',
        label: 'テラバイト (TB)',
        toBase: (v) => v * 1099511627776,
        fromBase: (v) => v / 1099511627776,
      },
    ],
  },
];

export function convert(
  value: number,
  fromUnit: string,
  toUnit: string,
  categoryName: string
): number {
  const category = CATEGORIES.find((c) => c.name === categoryName);
  if (!category) return 0;
  const from = category.units.find((u) => u.id === fromUnit);
  const to = category.units.find((u) => u.id === toUnit);
  if (!from || !to) return 0;
  const baseValue = from.toBase(value);
  return to.fromBase(baseValue);
}
