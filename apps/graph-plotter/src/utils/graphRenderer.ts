import { safeEvaluate } from './expressionParser';

export interface GraphConfig {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  width: number;
  height: number;
}

export interface FunctionDef {
  expression: string;
  color: string;
  label: string;
}

const GRAPH_COLORS = [
  '#2563eb', // blue
  '#dc2626', // red
  '#16a34a', // green
  '#9333ea', // purple
  '#ea580c', // orange
  '#0891b2', // cyan
  '#be185d', // pink
  '#ca8a04', // yellow
];

export function getColor(index: number): string {
  return GRAPH_COLORS[index % GRAPH_COLORS.length];
}

function worldToScreen(
  x: number,
  y: number,
  config: GraphConfig
): { sx: number; sy: number } {
  const sx = ((x - config.xMin) / (config.xMax - config.xMin)) * config.width;
  const sy = ((config.yMax - y) / (config.yMax - config.yMin)) * config.height;
  return { sx, sy };
}

function drawGrid(ctx: CanvasRenderingContext2D, config: GraphConfig) {
  const { xMin, xMax, yMin, yMax, width, height } = config;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Compute grid spacing
  const xRange = xMax - xMin;
  const yRange = yMax - yMin;
  const xStep = niceStep(xRange / 10);
  const yStep = niceStep(yRange / 10);

  // Grid lines
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;

  // Vertical grid lines
  const xStart = Math.ceil(xMin / xStep) * xStep;
  for (let x = xStart; x <= xMax; x += xStep) {
    const { sx } = worldToScreen(x, 0, config);
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, height);
    ctx.stroke();
  }

  // Horizontal grid lines
  const yStart = Math.ceil(yMin / yStep) * yStep;
  for (let y = yStart; y <= yMax; y += yStep) {
    const { sy } = worldToScreen(0, y, config);
    ctx.beginPath();
    ctx.moveTo(0, sy);
    ctx.lineTo(width, sy);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;

  // X axis
  if (yMin <= 0 && yMax >= 0) {
    const { sy } = worldToScreen(0, 0, config);
    ctx.beginPath();
    ctx.moveTo(0, sy);
    ctx.lineTo(width, sy);
    ctx.stroke();
  }

  // Y axis
  if (xMin <= 0 && xMax >= 0) {
    const { sx } = worldToScreen(0, 0, config);
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, height);
    ctx.stroke();
  }

  // Labels
  ctx.fillStyle = '#6b7280';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  for (let x = xStart; x <= xMax; x += xStep) {
    if (Math.abs(x) < xStep * 0.01) continue;
    const { sx, sy } = worldToScreen(x, 0, config);
    const labelY = yMin <= 0 && yMax >= 0 ? sy + 4 : height - 14;
    ctx.fillText(formatNum(x), sx, labelY);
  }

  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let y = yStart; y <= yMax; y += yStep) {
    if (Math.abs(y) < yStep * 0.01) continue;
    const { sx, sy } = worldToScreen(0, y, config);
    const labelX = xMin <= 0 && xMax >= 0 ? sx - 4 : 30;
    ctx.fillText(formatNum(y), labelX, sy);
  }
}

function niceStep(rough: number): number {
  const pow = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / pow;
  if (norm <= 1) return pow;
  if (norm <= 2) return 2 * pow;
  if (norm <= 5) return 5 * pow;
  return 10 * pow;
}

function formatNum(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2).replace(/\.?0+$/, '');
}

export function renderGraph(
  ctx: CanvasRenderingContext2D,
  functions: FunctionDef[],
  config: GraphConfig
) {
  drawGrid(ctx, config);

  const { xMin, xMax, width } = config;
  const step = (xMax - xMin) / width;

  for (const fn of functions) {
    if (!fn.expression.trim()) continue;

    ctx.strokeStyle = fn.color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    let started = false;
    let prevY: number | null = null;

    for (let px = 0; px <= width; px++) {
      const x = xMin + px * step;
      const y = safeEvaluate(fn.expression, x);

      if (y === null || !isFinite(y)) {
        started = false;
        prevY = null;
        continue;
      }

      const { sx, sy } = worldToScreen(x, y, config);

      // Detect discontinuities
      if (prevY !== null && Math.abs(y - prevY) > (config.yMax - config.yMin) * 0.5) {
        started = false;
      }

      if (!started) {
        ctx.moveTo(sx, sy);
        started = true;
      } else {
        ctx.lineTo(sx, sy);
      }

      prevY = y;
    }

    ctx.stroke();
  }
}
