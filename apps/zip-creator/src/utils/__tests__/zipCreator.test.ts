import { describe, it, expect } from 'vitest';
import { crc32, formatSize } from '../zipCreator';

describe('crc32', () => {
  it('should return 0 for empty data', () => {
    expect(crc32(new Uint8Array([]))).toBe(0);
  });

  it('should calculate CRC32 for known data', () => {
    // "hello" CRC32 = 0x3610a686
    const data = new TextEncoder().encode('hello');
    const result = crc32(data);
    expect(result).toBe(0x3610a686);
  });

  it('should return different values for different data', () => {
    const data1 = new TextEncoder().encode('abc');
    const data2 = new TextEncoder().encode('xyz');
    expect(crc32(data1)).not.toBe(crc32(data2));
  });
});

describe('formatSize', () => {
  it('should format 0 bytes', () => {
    expect(formatSize(0)).toBe('0 B');
  });

  it('should format kilobytes', () => {
    expect(formatSize(1024)).toBe('1.0 KB');
  });

  it('should format megabytes', () => {
    expect(formatSize(1048576)).toBe('1.0 MB');
  });
});
