import { describe, it, expect } from 'vitest';
import { createGrid, floodFill } from '../pixelArt';

describe('createGrid', () => {
  it('creates grid of specified size', () => {
    const grid = createGrid(8);
    expect(grid.length).toBe(8);
    expect(grid[0].length).toBe(8);
  });

  it('fills grid with white', () => {
    const grid = createGrid(4);
    for (const row of grid) {
      for (const cell of row) {
        expect(cell).toBe('#ffffff');
      }
    }
  });
});

describe('floodFill', () => {
  it('fills connected area with same color', () => {
    const grid = createGrid(4);
    const filled = floodFill(grid, 0, 0, '#ff0000');
    for (const row of filled) {
      for (const cell of row) {
        expect(cell).toBe('#ff0000');
      }
    }
  });

  it('does not fill across color boundaries', () => {
    const grid = createGrid(4);
    grid[1][0] = '#000000';
    grid[1][1] = '#000000';
    grid[1][2] = '#000000';
    grid[1][3] = '#000000';
    const filled = floodFill(grid, 0, 0, '#ff0000');
    expect(filled[0][0]).toBe('#ff0000');
    expect(filled[2][0]).toBe('#ffffff');
  });

  it('returns same grid when fill color matches target', () => {
    const grid = createGrid(4);
    const filled = floodFill(grid, 0, 0, '#ffffff');
    expect(filled).toBe(grid);
  });
});
