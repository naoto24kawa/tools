import { describe, expect, test } from 'bun:test';
import { generatePalette, generateShades, generateTints, hexToRgb, rgbToHex } from '../colorShade';

describe('colorShade', () => {
  test('hexToRgb', () => {
    expect(hexToRgb('#ff0000')).toEqual([255, 0, 0]);
  });
  test('hexToRgb invalid', () => {
    expect(hexToRgb('xyz')).toBeNull();
  });
  test('rgbToHex', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
  });

  test('generateShades produces count items', () => {
    expect(generateShades('#3b82f6', 5).length).toBe(5);
  });

  test('shades go from color to black', () => {
    const shades = generateShades('#ff0000', 5);
    expect(shades[0]).toBe('#ff0000');
    expect(shades[4]).toBe('#000000');
  });

  test('generateTints produces count items', () => {
    expect(generateTints('#3b82f6', 5).length).toBe(5);
  });

  test('tints go from color to white', () => {
    const tints = generateTints('#ff0000', 5);
    expect(tints[0]).toBe('#ff0000');
    expect(tints[4]).toBe('#ffffff');
  });

  test('generatePalette returns both', () => {
    const p = generatePalette('#3b82f6', 5);
    expect(p.shades.length).toBe(5);
    expect(p.tints.length).toBe(5);
  });

  test('invalid hex returns empty', () => {
    expect(generateShades('invalid', 5)).toEqual([]);
  });
});
