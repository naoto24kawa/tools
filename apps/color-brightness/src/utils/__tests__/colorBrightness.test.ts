import { describe, expect, test } from 'vitest';
import { adjustBrightness, adjustHue, adjustSaturation, getHSL } from '../colorBrightness';

describe('colorBrightness', () => {
  test('increase brightness', () => {
    const result = adjustBrightness('#333333', 20);
    const hsl = getHSL(result);
    expect(hsl.l).toBeGreaterThan(20);
  });

  test('decrease brightness', () => {
    const result = adjustBrightness('#cccccc', -20);
    const hsl = getHSL(result);
    expect(hsl.l).toBeLessThan(80);
  });

  test('increase saturation', () => {
    const result = adjustSaturation('#808080', 50);
    expect(result).not.toBe('#808080');
  });

  test('adjust hue', () => {
    const result = adjustHue('#ff0000', 120);
    expect(result).not.toBe('#ff0000');
  });

  test('no change at 0', () => {
    const original = '#3b82f6';
    expect(adjustBrightness(original, 0)).toBe(original);
  });

  test('getHSL returns valid values', () => {
    const hsl = getHSL('#ff0000');
    expect(hsl.h).toBeGreaterThanOrEqual(0);
    expect(hsl.s).toBeGreaterThanOrEqual(0);
    expect(hsl.l).toBeGreaterThanOrEqual(0);
  });

  test('clamps brightness to 0-100', () => {
    const result = adjustBrightness('#ffffff', 100);
    const hsl = getHSL(result);
    expect(hsl.l).toBeLessThanOrEqual(100);
  });
});
