import { describe, expect, test } from 'vitest';
import { getFormats, hexToRgb, rgbToHsl } from '../colorPicker';

describe('colorPicker', () => {
  test('hexToRgb', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
  });
  test('hexToRgb invalid', () => {
    expect(hexToRgb('xyz')).toBeNull();
  });
  test('rgbToHsl red', () => {
    expect(rgbToHsl(255, 0, 0).h).toBe(0);
  });
  test('rgbToHsl green', () => {
    expect(rgbToHsl(0, 255, 0).h).toBe(120);
  });
  test('getFormats has all keys', () => {
    const f = getFormats('#ff0000');
    expect(f.HEX).toBe('#ff0000');
    expect(f.RGB).toContain('255');
    expect(f.HSL).toContain('hsl');
  });
  test('getFormats invalid', () => {
    expect(Object.keys(getFormats('xyz')).length).toBe(0);
  });
});
