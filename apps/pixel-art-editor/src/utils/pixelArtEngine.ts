export type Tool = 'pencil' | 'eraser' | 'fill';

export interface PixelGrid {
  width: number;
  height: number;
  pixels: (string | null)[];
}

export function createGrid(size: number): PixelGrid {
  return {
    width: size,
    height: size,
    pixels: new Array(size * size).fill(null),
  };
}

export function setPixel(
  grid: PixelGrid,
  x: number,
  y: number,
  color: string | null
): PixelGrid {
  if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) return grid;
  const newPixels = [...grid.pixels];
  newPixels[y * grid.width + x] = color;
  return { ...grid, pixels: newPixels };
}

export function getPixel(grid: PixelGrid, x: number, y: number): string | null {
  if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) return null;
  return grid.pixels[y * grid.width + x];
}

export function floodFill(
  grid: PixelGrid,
  startX: number,
  startY: number,
  fillColor: string
): PixelGrid {
  const targetColor = getPixel(grid, startX, startY);
  if (targetColor === fillColor) return grid;

  const newPixels = [...grid.pixels];
  const stack: [number, number][] = [[startX, startY]];
  const visited = new Set<string>();

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const key = `${x},${y}`;
    if (visited.has(key)) continue;
    if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) continue;
    if (newPixels[y * grid.width + x] !== targetColor) continue;

    visited.add(key);
    newPixels[y * grid.width + x] = fillColor;

    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  return { ...grid, pixels: newPixels };
}

export function renderToCanvas(
  canvas: HTMLCanvasElement,
  grid: PixelGrid,
  showGrid: boolean,
  cellSize: number
): void {
  canvas.width = grid.width * cellSize;
  canvas.height = grid.height * cellSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw pixels
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const color = grid.pixels[y * grid.width + x];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // Draw grid lines
  if (showGrid) {
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= grid.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= grid.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(canvas.width, y * cellSize);
      ctx.stroke();
    }
  }
}

export function exportPng(canvas: HTMLCanvasElement, grid: PixelGrid, scale: number): void {
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = grid.width * scale;
  exportCanvas.height = grid.height * scale;
  const ctx = exportCanvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const color = grid.pixels[y * grid.width + x];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }

  const link = document.createElement('a');
  link.download = `pixel-art-${scale}x.png`;
  link.href = exportCanvas.toDataURL('image/png');
  link.click();
}

export function saveToStorage(grid: PixelGrid): void {
  localStorage.setItem('pixel-art-grid', JSON.stringify(grid));
}

export function loadFromStorage(): PixelGrid | null {
  const data = localStorage.getItem('pixel-art-grid');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}
