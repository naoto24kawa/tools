export type Tool = 'pencil' | 'eraser' | 'fill';

export function createGrid(size: number): string[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => '#ffffff'));
}

export function floodFill(
  grid: string[][],
  row: number,
  col: number,
  fillColor: string
): string[][] {
  const size = grid.length;
  const targetColor = grid[row][col];
  if (targetColor === fillColor) return grid;

  const newGrid = grid.map((r) => [...r]);
  const stack: [number, number][] = [[row, col]];

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    if (r < 0 || r >= size || c < 0 || c >= size) continue;
    if (newGrid[r][c] !== targetColor) continue;

    newGrid[r][c] = fillColor;
    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
  }

  return newGrid;
}

export function exportToPng(
  grid: string[][],
  scale: number = 16
): string {
  const size = grid.length;
  const canvas = document.createElement('canvas');
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext('2d')!;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      ctx.fillStyle = grid[r][c];
      ctx.fillRect(c * scale, r * scale, scale, scale);
    }
  }

  return canvas.toDataURL('image/png');
}
