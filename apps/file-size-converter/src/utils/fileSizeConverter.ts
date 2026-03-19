export type SIUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';
export type IECUnit = 'B' | 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB';
export type FileSizeUnit = SIUnit | IECUnit;

export interface ConversionResult {
  unit: FileSizeUnit;
  value: number;
  formatted: string;
}

const SI_UNITS: SIUnit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
const IEC_UNITS: IECUnit[] = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];

/**
 * Convert a file size value to bytes.
 */
export function toBytes(value: number, unit: FileSizeUnit): number {
  const siIndex = SI_UNITS.indexOf(unit as SIUnit);
  const iecIndex = IEC_UNITS.indexOf(unit as IECUnit);

  if (unit === 'B') return value;
  if (siIndex >= 0) return value * Math.pow(1000, siIndex);
  if (iecIndex >= 0) return value * Math.pow(1024, iecIndex);

  return value;
}

/**
 * Convert bytes to all SI units.
 */
export function convertToSI(bytes: number): ConversionResult[] {
  return SI_UNITS.map((unit, i) => {
    const value = bytes / Math.pow(1000, i);
    return {
      unit,
      value,
      formatted: formatPrecision(value),
    };
  });
}

/**
 * Convert bytes to all IEC (binary) units.
 */
export function convertToIEC(bytes: number): ConversionResult[] {
  return IEC_UNITS.map((unit, i) => {
    const value = bytes / Math.pow(1024, i);
    return {
      unit,
      value,
      formatted: formatPrecision(value),
    };
  });
}

/**
 * Convert a value from one unit to all units in both systems.
 */
export function convert(
  value: number,
  fromUnit: FileSizeUnit,
): { si: ConversionResult[]; iec: ConversionResult[] } {
  const bytes = toBytes(value, fromUnit);
  return {
    si: convertToSI(bytes),
    iec: convertToIEC(bytes),
  };
}

/**
 * Auto-format a byte value to the most appropriate unit.
 */
export function autoFormat(bytes: number, useBinary: boolean = false): string {
  const units = useBinary ? IEC_UNITS : SI_UNITS;
  const base = useBinary ? 1024 : 1000;

  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(base));
  const idx = Math.min(i, units.length - 1);
  const val = bytes / Math.pow(base, idx);
  return `${formatPrecision(val)} ${units[idx]}`;
}

function formatPrecision(value: number): string {
  if (value === 0) return '0';
  if (Math.abs(value) >= 100) return value.toFixed(2);
  if (Math.abs(value) >= 10) return value.toFixed(3);
  if (Math.abs(value) >= 1) return value.toFixed(4);
  return value.toFixed(6);
}

/**
 * Get all available units.
 */
export function getAllUnits(): FileSizeUnit[] {
  return [...SI_UNITS, ...IEC_UNITS.slice(1)]; // Skip duplicate 'B'
}

export { SI_UNITS, IEC_UNITS };
