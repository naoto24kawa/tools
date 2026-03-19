import { describe, expect, it } from 'vitest';
import { parseInput, squarify } from '../treemap';

describe('parseInput', () => {
  it('parses name,value pairs', () => {
    const result = parseInput('JavaScript, 65\nPython, 48\nRust, 30');
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ name: 'JavaScript', value: 65 });
    expect(result[1]).toEqual({ name: 'Python', value: 48 });
    expect(result[2]).toEqual({ name: 'Rust', value: 30 });
  });

  it('filters out invalid entries', () => {
    const result = parseInput('Valid, 10\nInvalid\n, NaN\nNeg, -5');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Valid');
  });

  it('filters out zero values', () => {
    const result = parseInput('Zero, 0\nValid, 10');
    expect(result).toHaveLength(1);
  });

  it('handles empty input', () => {
    expect(parseInput('')).toHaveLength(0);
  });
});

describe('squarify', () => {
  it('generates rectangles for given items', () => {
    const items = [
      { name: 'A', value: 6 },
      { name: 'B', value: 6 },
      { name: 'C', value: 4 },
      { name: 'D', value: 3 },
      { name: 'E', value: 2 },
      { name: 'F', value: 2 },
      { name: 'G', value: 1 },
    ];
    const rects = squarify(items, 0, 0, 600, 400);
    expect(rects).toHaveLength(7);

    // Total area should approximately equal container area
    const totalArea = rects.reduce((sum, r) => sum + r.width * r.height, 0);
    expect(totalArea).toBeCloseTo(600 * 400, -1);

    // All rects should be within bounds
    for (const rect of rects) {
      expect(rect.x).toBeGreaterThanOrEqual(0);
      expect(rect.y).toBeGreaterThanOrEqual(0);
      expect(rect.x + rect.width).toBeLessThanOrEqual(600 + 1); // tolerance
      expect(rect.y + rect.height).toBeLessThanOrEqual(400 + 1);
    }
  });

  it('returns empty array for empty input', () => {
    expect(squarify([], 0, 0, 600, 400)).toHaveLength(0);
  });

  it('handles single item', () => {
    const rects = squarify([{ name: 'Solo', value: 100 }], 0, 0, 400, 300);
    expect(rects).toHaveLength(1);
    expect(rects[0].width).toBeCloseTo(400, 0);
    expect(rects[0].height).toBeCloseTo(300, 0);
  });

  it('assigns colors to rectangles', () => {
    const items = [
      { name: 'A', value: 10 },
      { name: 'B', value: 20 },
    ];
    const rects = squarify(items, 0, 0, 400, 300);
    expect(rects[0].color).toBeTruthy();
    expect(rects[1].color).toBeTruthy();
  });
});
