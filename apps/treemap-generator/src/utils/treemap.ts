export interface TreemapItem {
  name: string;
  value: number;
}

export interface TreemapRect {
  name: string;
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const PALETTE = [
  '#4A90D9', '#50B86C', '#E6A23C', '#F56C6C',
  '#909399', '#9B59B6', '#1ABC9C', '#E74C3C',
  '#3498DB', '#2ECC71', '#F39C12', '#E91E63',
  '#00BCD4', '#FF9800', '#795548', '#607D8B',
];

export function parseInput(input: string): TreemapItem[] {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const parts = line.split(',').map((s) => s.trim());
      if (parts.length < 2) return null;
      const name = parts[0];
      const value = parseFloat(parts[1]);
      if (isNaN(value) || value <= 0) return null;
      return { name, value };
    })
    .filter((item): item is TreemapItem => item !== null);
}

function worstRatio(row: number[], w: number): number {
  const s = row.reduce((a, b) => a + b, 0);
  if (s === 0 || w === 0) return Infinity;
  const maxVal = Math.max(...row);
  const minVal = Math.min(...row);
  const s2 = s * s;
  const w2 = w * w;
  return Math.max((w2 * maxVal) / s2, s2 / (w2 * minVal));
}

export function squarify(
  items: TreemapItem[],
  x: number,
  y: number,
  width: number,
  height: number,
  colorOffset: number = 0
): TreemapRect[] {
  if (items.length === 0) return [];

  const totalValue = items.reduce((sum, item) => sum + item.value, 0);
  if (totalValue === 0) return [];

  // Normalize values to area
  const totalArea = width * height;
  const areas = items.map((item) => (item.value / totalValue) * totalArea);

  const rects: TreemapRect[] = [];
  let currentX = x;
  let currentY = y;
  let currentW = width;
  let currentH = height;

  const remaining = [...areas];
  const names = [...items.map((i) => i.name)];
  const values = [...items.map((i) => i.value)];

  while (remaining.length > 0) {
    const isVertical = currentW >= currentH;
    const side = isVertical ? currentH : currentW;

    // Greedy: add items to row while worst ratio improves
    const row: number[] = [];
    const rowNames: string[] = [];
    const rowValues: number[] = [];

    row.push(remaining[0]);
    rowNames.push(names[0]);
    rowValues.push(values[0]);
    remaining.shift();
    names.shift();
    values.shift();

    let prevWorst = worstRatio(row, side);

    while (remaining.length > 0) {
      const candidate = [...row, remaining[0]];
      const newWorst = worstRatio(candidate, side);
      if (newWorst <= prevWorst) {
        row.push(remaining[0]);
        rowNames.push(names[0]);
        rowValues.push(values[0]);
        remaining.shift();
        names.shift();
        values.shift();
        prevWorst = newWorst;
      } else {
        break;
      }
    }

    // Layout the row
    const rowSum = row.reduce((a, b) => a + b, 0);
    const rowWidth = isVertical ? rowSum / side : side;
    const rowHeight = isVertical ? side : rowSum / side;

    let offsetX = currentX;
    let offsetY = currentY;

    for (let i = 0; i < row.length; i++) {
      const itemArea = row[i];
      let rectW: number;
      let rectH: number;

      if (isVertical) {
        rectW = rowSum / side;
        rectH = itemArea / rectW;
        rects.push({
          name: rowNames[i],
          value: rowValues[i],
          x: offsetX,
          y: offsetY,
          width: rectW,
          height: rectH,
          color: PALETTE[(rects.length + colorOffset) % PALETTE.length],
        });
        offsetY += rectH;
      } else {
        rectH = rowSum / side;
        rectW = itemArea / rectH;
        rects.push({
          name: rowNames[i],
          value: rowValues[i],
          x: offsetX,
          y: offsetY,
          width: rectW,
          height: rectH,
          color: PALETTE[(rects.length + colorOffset) % PALETTE.length],
        });
        offsetX += rectW;
      }
    }

    // Update remaining area
    if (isVertical) {
      currentX += rowSum / side;
      currentW -= rowSum / side;
    } else {
      currentY += rowSum / side;
      currentH -= rowSum / side;
    }
  }

  return rects;
}

export function renderTreemapToCanvas(
  ctx: CanvasRenderingContext2D,
  rects: TreemapRect[],
  width: number,
  height: number,
  title: string
) {
  // Clear
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Title
  if (title) {
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 25);
  }

  const offsetY = title ? 40 : 0;

  for (const rect of rects) {
    // Fill
    ctx.fillStyle = rect.color;
    ctx.fillRect(rect.x, rect.y + offsetY, rect.width, rect.height);

    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.x, rect.y + offsetY, rect.width, rect.height);

    // Label (only if rect is large enough)
    if (rect.width > 30 && rect.height > 20) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const label = rect.name.length > rect.width / 8
        ? rect.name.substring(0, Math.floor(rect.width / 8)) + '..'
        : rect.name;

      ctx.fillText(
        label,
        rect.x + rect.width / 2,
        rect.y + offsetY + rect.height / 2 - 8
      );

      ctx.font = '10px sans-serif';
      ctx.fillText(
        String(rect.value),
        rect.x + rect.width / 2,
        rect.y + offsetY + rect.height / 2 + 8
      );
    }
  }

  ctx.textBaseline = 'alphabetic';
}

export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string) {
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
