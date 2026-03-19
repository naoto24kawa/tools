import { describe, it, expect } from 'vitest';
import {
  dmsToDecimal,
  decimalToDms,
  formatDms,
  parseDmsString,
  isValidDecimalLatitude,
  isValidDecimalLongitude,
  isValidDms,
} from '../coordinateConverter';

describe('dmsToDecimal', () => {
  it('should convert DMS to decimal (N)', () => {
    const result = dmsToDecimal({ degrees: 35, minutes: 41, seconds: 22.2, direction: 'N' });
    expect(result).toBeCloseTo(35.6895, 4);
  });

  it('should convert DMS to decimal (S)', () => {
    const result = dmsToDecimal({ degrees: 33, minutes: 51, seconds: 54, direction: 'S' });
    expect(result).toBeCloseTo(-33.865, 3);
  });

  it('should convert DMS to decimal (E)', () => {
    const result = dmsToDecimal({ degrees: 139, minutes: 41, seconds: 30, direction: 'E' });
    expect(result).toBeCloseTo(139.6917, 3);
  });

  it('should convert DMS to decimal (W)', () => {
    const result = dmsToDecimal({ degrees: 74, minutes: 0, seconds: 21.6, direction: 'W' });
    expect(result).toBeCloseTo(-74.006, 3);
  });
});

describe('decimalToDms', () => {
  it('should convert positive latitude to DMS', () => {
    const result = decimalToDms(35.6895, true);
    expect(result.direction).toBe('N');
    expect(result.degrees).toBe(35);
    expect(result.minutes).toBe(41);
    expect(result.seconds).toBeCloseTo(22.2, 1);
  });

  it('should convert negative latitude to DMS', () => {
    const result = decimalToDms(-33.865, true);
    expect(result.direction).toBe('S');
    expect(result.degrees).toBe(33);
  });

  it('should convert positive longitude to DMS', () => {
    const result = decimalToDms(139.6917, false);
    expect(result.direction).toBe('E');
    expect(result.degrees).toBe(139);
  });

  it('should convert negative longitude to DMS', () => {
    const result = decimalToDms(-74.006, false);
    expect(result.direction).toBe('W');
    expect(result.degrees).toBe(74);
  });
});

describe('formatDms', () => {
  it('should format DMS correctly', () => {
    const result = formatDms({ degrees: 35, minutes: 41, seconds: 22.2, direction: 'N' });
    expect(result).toContain('35');
    expect(result).toContain('41');
    expect(result).toContain('N');
  });
});

describe('parseDmsString', () => {
  it('should parse standard DMS format', () => {
    const result = parseDmsString('35\u00B0 41\' 22.2" N');
    expect(result).not.toBeNull();
    expect(result!.degrees).toBe(35);
    expect(result!.minutes).toBe(41);
    expect(result!.direction).toBe('N');
  });

  it('should return null for invalid input', () => {
    expect(parseDmsString('invalid')).toBeNull();
  });
});

describe('isValidDecimalLatitude', () => {
  it('should validate latitudes', () => {
    expect(isValidDecimalLatitude(0)).toBe(true);
    expect(isValidDecimalLatitude(90)).toBe(true);
    expect(isValidDecimalLatitude(-90)).toBe(true);
    expect(isValidDecimalLatitude(91)).toBe(false);
    expect(isValidDecimalLatitude(NaN)).toBe(false);
  });
});

describe('isValidDecimalLongitude', () => {
  it('should validate longitudes', () => {
    expect(isValidDecimalLongitude(0)).toBe(true);
    expect(isValidDecimalLongitude(180)).toBe(true);
    expect(isValidDecimalLongitude(-180)).toBe(true);
    expect(isValidDecimalLongitude(181)).toBe(false);
  });
});

describe('isValidDms', () => {
  it('should validate correct DMS', () => {
    expect(isValidDms({ degrees: 35, minutes: 41, seconds: 22.2, direction: 'N' })).toBe(true);
  });

  it('should reject invalid minutes', () => {
    expect(isValidDms({ degrees: 35, minutes: 61, seconds: 0, direction: 'N' })).toBe(false);
  });
});
