import { describe, it, expect } from 'vitest';
import { convertFileSize, convertToAll, getUnitLabel } from '../fileSize';

describe('convertFileSize', () => {
  it('converts bytes to KB (SI)', () => {
    expect(convertFileSize(1000, 'B', 'KB', 'SI')).toBe(1);
  });

  it('converts bytes to KB (IEC)', () => {
    expect(convertFileSize(1024, 'B', 'KB', 'IEC')).toBe(1);
  });

  it('converts KB to MB (SI)', () => {
    expect(convertFileSize(1000, 'KB', 'MB', 'SI')).toBe(1);
  });

  it('converts KB to MB (IEC)', () => {
    expect(convertFileSize(1024, 'KB', 'MB', 'IEC')).toBe(1);
  });

  it('converts GB to B (SI)', () => {
    expect(convertFileSize(1, 'GB', 'B', 'SI')).toBe(1_000_000_000);
  });

  it('converts GB to B (IEC)', () => {
    expect(convertFileSize(1, 'GB', 'B', 'IEC')).toBe(1073741824);
  });

  it('converts same unit', () => {
    expect(convertFileSize(42, 'MB', 'MB', 'SI')).toBe(42);
  });

  it('throws for negative values', () => {
    expect(() => convertFileSize(-1, 'B', 'KB', 'SI')).toThrow();
  });
});

describe('convertToAll', () => {
  it('returns conversions for all units', () => {
    const results = convertToAll(1, 'GB', 'SI');
    expect(results).toHaveLength(6);
    const mbResult = results.find((r) => r.unit === 'MB');
    expect(mbResult?.value).toBe(1000);
  });
});

describe('getUnitLabel', () => {
  it('returns SI labels', () => {
    expect(getUnitLabel('KB', 'SI')).toBe('KB');
    expect(getUnitLabel('MB', 'SI')).toBe('MB');
  });

  it('returns IEC labels', () => {
    expect(getUnitLabel('KB', 'IEC')).toBe('KiB');
    expect(getUnitLabel('MB', 'IEC')).toBe('MiB');
    expect(getUnitLabel('GB', 'IEC')).toBe('GiB');
  });

  it('returns B for bytes in both standards', () => {
    expect(getUnitLabel('B', 'SI')).toBe('B');
    expect(getUnitLabel('B', 'IEC')).toBe('B');
  });
});
