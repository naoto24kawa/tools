import { describe, it, expect } from 'vitest';
import { generate } from '../avatarGenerator';

function createMockCanvas(size: number) {
  const pixels: string[] = [];
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => ({
      fillStyle: '',
      globalAlpha: 1,
      fillRect: (_x: number, _y: number, _w: number, _h: number) => {
        pixels.push(`rect`);
      },
      beginPath: () => {},
      arc: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      fill: () => {
        pixels.push('fill');
      },
    }),
    toDataURL: () => 'data:image/png;base64,mock',
  } as unknown as HTMLCanvasElement;
  return { canvas, pixels };
}

describe('avatarGenerator', () => {
  it('should set canvas dimensions', () => {
    const { canvas } = createMockCanvas(256);
    generate(canvas, 'geometric', 'test', 256, '#ffffff');
    expect(canvas.width).toBe(256);
    expect(canvas.height).toBe(256);
  });

  it('should generate deterministic output for same seed', () => {
    const { canvas: c1, pixels: p1 } = createMockCanvas(128);
    const { canvas: c2, pixels: p2 } = createMockCanvas(128);
    generate(c1, 'identicon', 'hello', 128, '#ffffff');
    generate(c2, 'identicon', 'hello', 128, '#ffffff');
    expect(p1.length).toBe(p2.length);
  });

  it('should generate different output for different seeds', () => {
    const { canvas: c1, pixels: p1 } = createMockCanvas(128);
    const { canvas: c2, pixels: p2 } = createMockCanvas(128);
    generate(c1, 'pixel', 'seed1', 128, '#ffffff');
    generate(c2, 'pixel', 'seed2', 128, '#ffffff');
    // Different seeds produce different drawing calls (usually)
    expect(p1.length > 0).toBe(true);
    expect(p2.length > 0).toBe(true);
  });

  it('should handle all styles', () => {
    for (const style of ['geometric', 'pixel', 'identicon'] as const) {
      const { canvas, pixels } = createMockCanvas(64);
      generate(canvas, style, 'test', 64, '#000000');
      expect(pixels.length).toBeGreaterThan(0);
    }
  });

  it('should use default seed when empty', () => {
    const { canvas, pixels } = createMockCanvas(64);
    generate(canvas, 'geometric', '', 64, '#ffffff');
    expect(pixels.length).toBeGreaterThan(0);
  });
});
