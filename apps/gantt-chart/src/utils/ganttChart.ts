export interface GanttTask {
  name: string;
  start: string; // YYYY-MM-DD
  duration: number; // days
  category: string;
}

export interface ParsedTask extends GanttTask {
  startDate: Date;
  endDate: Date;
}

const CATEGORY_COLORS: Record<string, string> = {
  design: '#4A90D9',
  dev: '#50B86C',
  test: '#E6A23C',
  deploy: '#F56C6C',
  plan: '#9B59B6',
  review: '#1ABC9C',
};

const FALLBACK_COLORS = [
  '#4A90D9', '#50B86C', '#E6A23C', '#F56C6C',
  '#909399', '#9B59B6', '#1ABC9C', '#E74C3C',
];

export function getCategoryColor(category: string, index: number): string {
  const lower = category.toLowerCase();
  if (CATEGORY_COLORS[lower]) return CATEGORY_COLORS[lower];
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export function parseInput(input: string): ParsedTask[] {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .map((line) => {
      const parts = line.split(',').map((s) => s.trim());
      if (parts.length < 3) return null;

      const name = parts[0];
      const start = parts[1];
      const duration = parseInt(parts[2]);
      const category = parts[3] || 'default';

      if (!isValidDate(start) || isNaN(duration) || duration <= 0) return null;

      const startDate = new Date(start + 'T00:00:00');
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + duration);

      return { name, start, duration, category, startDate, endDate };
    })
    .filter((item): item is ParsedTask => item !== null);
}

function isValidDate(dateStr: string): boolean {
  const match = dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
  if (!match) return false;
  const d = new Date(dateStr + 'T00:00:00');
  return !isNaN(d.getTime());
}

export function formatDate(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${m}/${d}`;
}

export function renderGanttChart(
  ctx: CanvasRenderingContext2D,
  tasks: ParsedTask[],
  width: number,
  height: number,
  title: string
) {
  // Clear
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  if (tasks.length === 0) {
    ctx.fillStyle = '#999';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No tasks to display', width / 2, height / 2);
    return;
  }

  // Title
  const titleHeight = title ? 35 : 0;
  if (title) {
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 25);
  }

  const padding = { top: titleHeight + 40, left: 160, right: 30, bottom: 40 };
  const chartWidth = width - padding.left - padding.right;
  const rowHeight = 32;
  const gap = 6;

  // Find timeline bounds
  const minDate = new Date(
    Math.min(...tasks.map((t) => t.startDate.getTime()))
  );
  const maxDate = new Date(
    Math.max(...tasks.map((t) => t.endDate.getTime()))
  );
  const totalDays = Math.ceil(
    (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const dayWidth = totalDays > 0 ? chartWidth / totalDays : chartWidth;

  // Header - date markers
  ctx.fillStyle = '#666';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';

  const markerInterval = Math.max(1, Math.ceil(totalDays / 15));
  for (let d = 0; d <= totalDays; d += markerInterval) {
    const markerDate = new Date(minDate);
    markerDate.setDate(markerDate.getDate() + d);
    const x = padding.left + d * dayWidth;

    ctx.fillText(formatDate(markerDate), x, padding.top - 10);

    // Vertical grid line
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + tasks.length * (rowHeight + gap));
    ctx.stroke();
  }

  // Collect unique categories for coloring
  const categoryMap = new Map<string, number>();
  let catIndex = 0;
  for (const task of tasks) {
    if (!categoryMap.has(task.category)) {
      categoryMap.set(task.category, catIndex++);
    }
  }

  // Draw tasks
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const y = padding.top + i * (rowHeight + gap);
    const startOffset = Math.ceil(
      (task.startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const barX = padding.left + startOffset * dayWidth;
    const barWidth = Math.max(task.duration * dayWidth, 4);

    // Row background (alternating)
    if (i % 2 === 0) {
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, y, width, rowHeight);
    }

    // Task label
    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(
      task.name.substring(0, 20),
      padding.left - 10,
      y + rowHeight / 2 + 4
    );

    // Task bar
    const color = getCategoryColor(
      task.category,
      categoryMap.get(task.category) ?? 0
    );
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(barX, y + 4, barWidth, rowHeight - 8, 4);
    ctx.fill();

    // Duration label on bar
    if (barWidth > 30) {
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${task.duration}d`, barX + barWidth / 2, y + rowHeight / 2 + 3);
    }
  }

  // Legend
  const legendY = padding.top + tasks.length * (rowHeight + gap) + 20;
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  let legendX = padding.left;

  for (const [category, idx] of categoryMap) {
    const color = getCategoryColor(category, idx);
    ctx.fillStyle = color;
    ctx.fillRect(legendX, legendY, 12, 12);
    ctx.fillStyle = '#666';
    ctx.fillText(category, legendX + 16, legendY + 10);
    legendX += ctx.measureText(category).width + 36;
  }
}

export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string) {
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
