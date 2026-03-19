export interface ChartDataset {
  labels: string[];
  values: number[];
  colors: string[];
}

export interface ChartConfig {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  width: number;
  height: number;
}

const DEFAULT_COLORS = [
  '#4A90D9', '#50B86C', '#E6A23C', '#F56C6C',
  '#909399', '#9B59B6', '#1ABC9C', '#E74C3C',
  '#3498DB', '#2ECC71', '#F39C12', '#E91E63',
];

export function getDefaultColor(index: number): string {
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

export function parseTableData(input: string): ChartDataset {
  const lines = input
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const labels: string[] = [];
  const values: number[] = [];
  const colors: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split(',').map((s) => s.trim());
    if (parts.length >= 2) {
      labels.push(parts[0]);
      values.push(parseFloat(parts[1]) || 0);
      colors.push(parts[2] || getDefaultColor(i));
    }
  }

  return { labels, values, colors };
}

function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
}

function drawTitle(ctx: CanvasRenderingContext2D, title: string, width: number) {
  if (!title) return;
  ctx.fillStyle = '#333';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, 30);
}

export function renderBarChart(
  ctx: CanvasRenderingContext2D,
  dataset: ChartDataset,
  config: ChartConfig
) {
  const { width, height } = config;
  clearCanvas(ctx, width, height);
  drawTitle(ctx, config.title, width);

  if (dataset.labels.length === 0) return;

  const padding = { top: 50, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...dataset.values, 1);
  const barCount = dataset.labels.length;
  const barWidth = Math.min(chartWidth / barCount * 0.7, 60);
  const gap = chartWidth / barCount;

  // Y axis
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;
  const gridLines = 5;
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#666';
  ctx.textAlign = 'right';
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + chartHeight - (i / gridLines) * chartHeight;
    const val = ((i / gridLines) * maxValue).toFixed(0);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(val, padding.left - 8, y + 4);
  }

  // Y axis label
  if (config.yAxisLabel) {
    ctx.save();
    ctx.translate(15, padding.top + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(config.yAxisLabel, 0, 0);
    ctx.restore();
  }

  // Bars
  for (let i = 0; i < barCount; i++) {
    const x = padding.left + i * gap + (gap - barWidth) / 2;
    const barHeight = (dataset.values[i] / maxValue) * chartHeight;
    const y = padding.top + chartHeight - barHeight;

    ctx.fillStyle = dataset.colors[i] || getDefaultColor(i);
    ctx.fillRect(x, y, barWidth, barHeight);

    // Value on top
    ctx.fillStyle = '#333';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(dataset.values[i]), x + barWidth / 2, y - 5);

    // Label
    ctx.fillStyle = '#666';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      dataset.labels[i].substring(0, 10),
      x + barWidth / 2,
      padding.top + chartHeight + 18
    );
  }

  // X axis label
  if (config.xAxisLabel) {
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(config.xAxisLabel, width / 2, height - 10);
  }
}

export function renderLineChart(
  ctx: CanvasRenderingContext2D,
  dataset: ChartDataset,
  config: ChartConfig
) {
  const { width, height } = config;
  clearCanvas(ctx, width, height);
  drawTitle(ctx, config.title, width);

  if (dataset.labels.length === 0) return;

  const padding = { top: 50, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...dataset.values, 1);
  const pointCount = dataset.labels.length;

  // Grid
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#666';
  ctx.textAlign = 'right';
  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + chartHeight - (i / gridLines) * chartHeight;
    const val = ((i / gridLines) * maxValue).toFixed(0);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(val, padding.left - 8, y + 4);
  }

  // Y axis label
  if (config.yAxisLabel) {
    ctx.save();
    ctx.translate(15, padding.top + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(config.yAxisLabel, 0, 0);
    ctx.restore();
  }

  // Line
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < pointCount; i++) {
    const x = padding.left + (i / Math.max(pointCount - 1, 1)) * chartWidth;
    const y = padding.top + chartHeight - (dataset.values[i] / maxValue) * chartHeight;
    points.push({ x, y });
  }

  // Draw line
  ctx.strokeStyle = dataset.colors[0] || getDefaultColor(0);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    if (i === 0) ctx.moveTo(points[i].x, points[i].y);
    else ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  // Draw points
  for (let i = 0; i < points.length; i++) {
    ctx.fillStyle = dataset.colors[i] || getDefaultColor(0);
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Value
    ctx.fillStyle = '#333';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(dataset.values[i]), points[i].x, points[i].y - 10);

    // Label
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText(
      dataset.labels[i].substring(0, 10),
      points[i].x,
      padding.top + chartHeight + 18
    );
  }

  // X axis label
  if (config.xAxisLabel) {
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(config.xAxisLabel, width / 2, height - 10);
  }
}

export function renderPieChart(
  ctx: CanvasRenderingContext2D,
  dataset: ChartDataset,
  config: ChartConfig
) {
  const { width, height } = config;
  clearCanvas(ctx, width, height);
  drawTitle(ctx, config.title, width);

  if (dataset.labels.length === 0) return;

  const total = dataset.values.reduce((sum, v) => sum + Math.abs(v), 0);
  if (total === 0) return;

  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const radius = Math.min(width, height) / 2 - 80;

  let startAngle = -Math.PI / 2;

  for (let i = 0; i < dataset.labels.length; i++) {
    const sliceAngle = (Math.abs(dataset.values[i]) / total) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;

    // Draw slice
    ctx.fillStyle = dataset.colors[i] || getDefaultColor(i);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();

    // Stroke
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label
    const midAngle = startAngle + sliceAngle / 2;
    const labelRadius = radius + 25;
    const lx = centerX + Math.cos(midAngle) * labelRadius;
    const ly = centerY + Math.sin(midAngle) * labelRadius;
    const percentage = ((Math.abs(dataset.values[i]) / total) * 100).toFixed(1);

    ctx.fillStyle = '#333';
    ctx.font = '11px sans-serif';
    ctx.textAlign = Math.cos(midAngle) > 0 ? 'left' : 'right';
    ctx.fillText(`${dataset.labels[i]} (${percentage}%)`, lx, ly);

    startAngle = endAngle;
  }
}

export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string) {
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
