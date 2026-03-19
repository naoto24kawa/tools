import { describe, it, expect } from 'vitest';
import {
  convert,
  checkWcagMinSize,
  modularScale,
  conversionTable,
  COMMON_RATIOS,
} from '../fontSizeCalc';

describe('convert', () => {
  it('should convert px to rem with default base', () => {
    const result = convert(16, 'px', 16);
    expect(result.px).toBe(16);
    expect(result.rem).toBe(1);
    expect(result.em).toBe(1);
  });

  it('should convert rem to px', () => {
    const result = convert(2, 'rem', 16);
    expect(result.px).toBe(32);
  });

  it('should convert em to px', () => {
    const result = convert(1.5, 'em', 16);
    expect(result.px).toBe(24);
  });

  it('should convert pt to px', () => {
    const result = convert(12, 'pt', 16);
    expect(result.px).toBe(16);
  });

  it('should handle custom base size', () => {
    const result = convert(1, 'rem', 20);
    expect(result.px).toBe(20);
  });
});

describe('checkWcagMinSize', () => {
  it('should pass for 16px', () => {
    const result = checkWcagMinSize(16);
    expect(result.passes).toBe(true);
  });

  it('should pass for 12px with warning', () => {
    const result = checkWcagMinSize(12);
    expect(result.passes).toBe(true);
    expect(result.message).toContain('minimum');
  });

  it('should fail for 10px', () => {
    const result = checkWcagMinSize(10);
    expect(result.passes).toBe(false);
  });
});

describe('modularScale', () => {
  it('should generate scale steps', () => {
    const scale = modularScale(16, 1.25, 4);
    expect(scale.length).toBeGreaterThan(4);
    // Step 0 should be the base size
    const base = scale.find((s) => s.step === 0);
    expect(base).toBeDefined();
    expect(base!.px).toBeCloseTo(16, 0);
  });

  it('should increase with each step', () => {
    const scale = modularScale(16, 1.5, 4);
    for (let i = 1; i < scale.length; i++) {
      expect(scale[i].px).toBeGreaterThan(scale[i - 1].px);
    }
  });
});

describe('conversionTable', () => {
  it('should generate a table of conversions', () => {
    const table = conversionTable(16);
    expect(table.length).toBeGreaterThan(10);
    // 16px should be 1rem
    const entry16 = table.find((t) => t.px === 16);
    expect(entry16).toBeDefined();
    expect(entry16!.rem).toBe(1);
  });
});

describe('COMMON_RATIOS', () => {
  it('should contain common typographic ratios', () => {
    expect(COMMON_RATIOS.length).toBeGreaterThanOrEqual(5);
    const golden = COMMON_RATIOS.find((r) => r.name.includes('Golden'));
    expect(golden).toBeDefined();
    expect(golden!.value).toBeCloseTo(1.618, 2);
  });
});
