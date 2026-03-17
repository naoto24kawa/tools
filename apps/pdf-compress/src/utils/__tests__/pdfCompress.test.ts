import { describe, expect, it } from 'bun:test';
import { calculateSavings, formatFileSize } from '../pdfCompress';

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1023)).toBe('1023 B');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(10240)).toBe('10.0 KB');
    expect(formatFileSize(1024 * 1024 - 1)).toBe('1024.0 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
    expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
    expect(formatFileSize(10 * 1024 * 1024)).toBe('10.0 MB');
    expect(formatFileSize(100 * 1024 * 1024)).toBe('100.0 MB');
  });
});

describe('calculateSavings', () => {
  it('calculates savings correctly', () => {
    const result = calculateSavings(1000, 700);
    expect(result.saved).toBe(300);
    expect(result.percent).toBe(30);
  });

  it('handles zero original size', () => {
    const result = calculateSavings(0, 0);
    expect(result.saved).toBe(0);
    expect(result.percent).toBe(0);
  });

  it('handles no savings', () => {
    const result = calculateSavings(1000, 1000);
    expect(result.saved).toBe(0);
    expect(result.percent).toBe(0);
  });

  it('handles negative savings (larger output)', () => {
    const result = calculateSavings(1000, 1200);
    expect(result.saved).toBe(-200);
    expect(result.percent).toBe(-20);
  });

  it('rounds percent to nearest integer', () => {
    const result = calculateSavings(1000, 667);
    expect(result.saved).toBe(333);
    expect(result.percent).toBe(33);
  });
});
