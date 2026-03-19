import { describe, it, expect } from 'vitest';
import { createGrid, setPixel, getPixel, floodFill } from '../pixelArtEngine';

describe('pixelArtEngine', () => {
  it('should create empty grid', () => {
    const grid = createGrid(8);
    expect(grid.width).toBe(8);
    expect(grid.height).toBe(8);
    expect(grid.pixels.length).toBe(64);
    expect(grid.pixels.every((p) => p === null)).toBe(true);
  });

  it('should set and get pixel', () => {
    let grid = createGrid(8);
    grid = setPixel(grid, 3, 4, '#ff0000');
    expect(getPixel(grid, 3, 4)).toBe('#ff0000');
    expect(getPixel(grid, 0, 0)).toBe(null);
  });

  it('should handle out-of-bounds gracefully', () => {
    const grid = createGrid(8);
    const same = setPixel(grid, -1, 0, '#ff0000');
    expect(same).toBe(grid);
    expect(getPixel(grid, -1, 0)).toBe(null);
    expect(getPixel(grid, 100, 100)).toBe(null);
  });

  it('should flood fill', () => {
    let grid = createGrid(4);
    grid = floodFill(grid, 0, 0, '#0000ff');
    for (const p of grid.pixels) {
      expect(p).toBe('#0000ff');
    }
  });

  it('should flood fill bounded area', () => {
    let grid = createGrid(4);
    // Create a wall
    grid = setPixel(grid, 1, 0, '#ff0000');
    grid = setPixel(grid, 1, 1, '#ff0000');
    grid = setPixel(grid, 1, 2, '#ff0000');
    grid = setPixel(grid, 1, 3, '#ff0000');
    // Fill left side
    grid = floodFill(grid, 0, 0, '#00ff00');
    expect(getPixel(grid, 0, 0)).toBe('#00ff00');
    expect(getPixel(grid, 2, 0)).toBe(null);
  });

  it('should not fill if same color', () => {
    let grid = createGrid(4);
    grid = floodFill(grid, 0, 0, '#00ff00');
    const filled = floodFill(grid, 0, 0, '#00ff00');
    expect(filled.pixels).toEqual(grid.pixels);
  });
});
