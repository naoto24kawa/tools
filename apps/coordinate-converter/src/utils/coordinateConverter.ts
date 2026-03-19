export interface DMS {
  degrees: number;
  minutes: number;
  seconds: number;
  direction: 'N' | 'S' | 'E' | 'W';
}

/**
 * Convert DMS (degrees, minutes, seconds) to decimal degrees.
 */
export function dmsToDecimal(dms: DMS): number {
  const sign = dms.direction === 'S' || dms.direction === 'W' ? -1 : 1;
  return sign * (Math.abs(dms.degrees) + dms.minutes / 60 + dms.seconds / 3600);
}

/**
 * Convert decimal degrees to DMS.
 */
export function decimalToDms(
  decimal: number,
  isLatitude: boolean,
): DMS {
  const direction = isLatitude
    ? decimal >= 0 ? 'N' : 'S'
    : decimal >= 0 ? 'E' : 'W';
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;

  return { degrees, minutes, seconds: Math.round(seconds * 10000) / 10000, direction };
}

/**
 * Format DMS as a readable string.
 */
export function formatDms(dms: DMS): string {
  return `${dms.degrees}\u00B0 ${dms.minutes}' ${dms.seconds.toFixed(4)}" ${dms.direction}`;
}

/**
 * Parse a DMS string like `35° 41' 22.2000" N` into a DMS object.
 */
export function parseDmsString(str: string): DMS | null {
  // Match patterns like: 35° 41' 22.2" N or 35 41 22.2 N
  const re = /(-?\d+)[°\s]+(\d+)['\s]+(\d+\.?\d*)["\s]*([NSEW])?/i;
  const match = str.trim().match(re);
  if (!match) return null;

  const degrees = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseFloat(match[3]);
  const dir = (match[4]?.toUpperCase() || 'N') as DMS['direction'];

  if (minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) return null;

  return { degrees: Math.abs(degrees), minutes, seconds, direction: dir };
}

/**
 * Validate decimal latitude.
 */
export function isValidDecimalLatitude(val: number): boolean {
  return !Number.isNaN(val) && val >= -90 && val <= 90;
}

/**
 * Validate decimal longitude.
 */
export function isValidDecimalLongitude(val: number): boolean {
  return !Number.isNaN(val) && val >= -180 && val <= 180;
}

/**
 * Validate DMS values.
 */
export function isValidDms(dms: DMS): boolean {
  if (dms.degrees < 0 || dms.minutes < 0 || dms.minutes >= 60) return false;
  if (dms.seconds < 0 || dms.seconds >= 60) return false;
  const decimal = dmsToDecimal(dms);
  const isLat = dms.direction === 'N' || dms.direction === 'S';
  return isLat ? isValidDecimalLatitude(decimal) : isValidDecimalLongitude(decimal);
}
