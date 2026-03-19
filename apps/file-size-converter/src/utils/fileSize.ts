export type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';
export type Standard = 'SI' | 'IEC';

const SI_UNITS: Unit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
const IEC_UNITS: Unit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

export function getBase(standard: Standard): number {
  return standard === 'SI' ? 1000 : 1024;
}

export function getUnitLabel(unit: Unit, standard: Standard): string {
  if (unit === 'B') return 'B';
  const iecMap: Record<string, string> = {
    KB: 'KiB',
    MB: 'MiB',
    GB: 'GiB',
    TB: 'TiB',
    PB: 'PiB',
  };
  return standard === 'IEC' ? iecMap[unit] || unit : unit;
}

export function getUnitIndex(unit: Unit): number {
  return SI_UNITS.indexOf(unit);
}

export function convertFileSize(
  value: number,
  fromUnit: Unit,
  toUnit: Unit,
  standard: Standard,
): number {
  if (value < 0) throw new Error('Value must be non-negative');
  const base = getBase(standard);
  const fromIndex = getUnitIndex(fromUnit);
  const toIndex = getUnitIndex(toUnit);
  const diff = fromIndex - toIndex;
  return value * Math.pow(base, diff);
}

export interface ConversionResult {
  unit: Unit;
  label: string;
  value: number;
  formatted: string;
}

export function convertToAll(
  value: number,
  fromUnit: Unit,
  standard: Standard,
): ConversionResult[] {
  return SI_UNITS.map((unit) => {
    const converted = convertFileSize(value, fromUnit, unit, standard);
    return {
      unit,
      label: getUnitLabel(unit, standard),
      value: converted,
      formatted: formatNumber(converted),
    };
  });
}

function formatNumber(n: number): string {
  if (n === 0) return '0';
  if (n >= 1) {
    // Show up to 6 significant decimal places
    const str = n.toFixed(10);
    // Remove trailing zeros
    return str.replace(/\.?0+$/, '');
  }
  // Very small numbers
  return n.toPrecision(6).replace(/\.?0+$/, '');
}

export const ALL_UNITS: Unit[] = SI_UNITS;
