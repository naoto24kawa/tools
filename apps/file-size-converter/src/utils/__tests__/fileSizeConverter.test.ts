import { describe, it, expect } from 'vitest';
import { toBytes, convert, autoFormat } from '../fileSizeConverter';

describe('toBytes', () => {
  it('should return same value for B', () => {
    expect(toBytes(100, 'B')).toBe(100);
  });

  it('should convert KB (SI)', () => {
    expect(toBytes(1, 'KB')).toBe(1000);
  });

  it('should convert MB (SI)', () => {
    expect(toBytes(1, 'MB')).toBe(1000000);
  });

  it('should convert GB (SI)', () => {
    expect(toBytes(1, 'GB')).toBe(1000000000);
  });

  it('should convert KiB (IEC)', () => {
    expect(toBytes(1, 'KiB')).toBe(1024);
  });

  it('should convert MiB (IEC)', () => {
    expect(toBytes(1, 'MiB')).toBe(1048576);
  });

  it('should convert GiB (IEC)', () => {
    expect(toBytes(1, 'GiB')).toBe(1073741824);
  });
});

describe('convert', () => {
  it('should convert to both SI and IEC', () => {
    const result = convert(1, 'GB');
    expect(result.si.length).toBe(6);
    expect(result.iec.length).toBe(6);
    // 1 GB = 1,000,000,000 bytes
    expect(result.si[0].value).toBe(1000000000);
    // 1 GB in GiB
    const gib = result.iec.find((r) => r.unit === 'GiB');
    expect(gib).toBeDefined();
    expect(gib!.value).toBeCloseTo(0.9313, 3);
  });
});

describe('autoFormat', () => {
  it('should format 0 bytes', () => {
    expect(autoFormat(0)).toBe('0 B');
  });

  it('should format bytes in SI', () => {
    expect(autoFormat(1500)).toContain('KB');
  });

  it('should format bytes in IEC', () => {
    expect(autoFormat(1500, true)).toContain('KiB');
  });

  it('should format large values', () => {
    expect(autoFormat(1000000000)).toContain('GB');
  });
});
