import { describe, it, expect } from 'vitest';
import { parseHexColor, toHex, generateCSS, type ColorPoint } from '../gradientMesh';

describe('gradientMesh', () => {
  it('should parse hex color', () => {
    expect(parseHexColor('#ff0000')).toEqual([255, 0, 0]);
    expect(parseHexColor('#00ff00')).toEqual([0, 255, 0]);
    expect(parseHexColor('#0000ff')).toEqual([0, 0, 255]);
  });

  it('should convert rgb to hex', () => {
    expect(toHex([255, 0, 0])).toBe('#ff0000');
    expect(toHex([0, 128, 255])).toBe('#0080ff');
  });

  it('should generate CSS for empty points', () => {
    const css = generateCSS([]);
    expect(css).toBe('background: #ffffff;');
  });

  it('should generate CSS with radial gradients', () => {
    const points: ColorPoint[] = [
      { x: 0, y: 0, color: [255, 0, 0] },
      { x: 1, y: 1, color: [0, 0, 255] },
    ];
    const css = generateCSS(points);
    expect(css).toContain('radial-gradient');
    expect(css).toContain('#ff0000');
    expect(css).toContain('#0000ff');
  });
});
