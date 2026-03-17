import { describe, expect, test } from 'bun:test';
import { DEFAULT_OPTIONS, FIT_MODES, formatFileSize, PAGE_SIZES } from '../imageToPdf';

describe('imageToPdf', () => {
  test('default options valid', () => {
    expect(DEFAULT_OPTIONS.margin).toBeGreaterThanOrEqual(0);
    expect(PAGE_SIZES).toContain(DEFAULT_OPTIONS.pageSize);
  });
  test('page sizes defined', () => {
    expect(PAGE_SIZES.length).toBe(5);
  });
  test('fit modes defined', () => {
    expect(FIT_MODES.length).toBe(3);
  });
  test('formatFileSize', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
  });
});
