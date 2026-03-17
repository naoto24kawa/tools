import { describe, expect, test } from 'vitest';
import { DEFAULT_OPTIONS } from '../codeToImage';

describe('codeToImage', () => {
  test('default options are valid', () => {
    expect(DEFAULT_OPTIONS.fontSize).toBeGreaterThan(0);
    expect(DEFAULT_OPTIONS.padding).toBeGreaterThan(0);
    expect(DEFAULT_OPTIONS.backgroundColor).toMatch(/^#/);
    expect(DEFAULT_OPTIONS.textColor).toMatch(/^#/);
  });

  test('lineHeight is reasonable', () => {
    expect(DEFAULT_OPTIONS.lineHeight).toBeGreaterThanOrEqual(1);
    expect(DEFAULT_OPTIONS.lineHeight).toBeLessThanOrEqual(3);
  });
});
