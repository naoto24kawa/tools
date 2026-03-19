import { describe, test, expect } from 'vitest';
import { formatBytes, formatNumber } from '../npmRegistry';

describe('formatBytes', () => {
  test('should format 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  test('should format bytes', () => {
    expect(formatBytes(500)).toBe('500 B');
  });

  test('should format kilobytes', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
  });

  test('should format megabytes', () => {
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(2621440)).toBe('2.5 MB');
  });

  test('should format gigabytes', () => {
    expect(formatBytes(1073741824)).toBe('1 GB');
  });
});

describe('formatNumber', () => {
  test('should format small numbers as-is', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(999)).toBe('999');
  });

  test('should format thousands', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(999999)).toBe('1000.0K');
  });

  test('should format millions', () => {
    expect(formatNumber(1000000)).toBe('1.0M');
    expect(formatNumber(2500000)).toBe('2.5M');
  });
});
