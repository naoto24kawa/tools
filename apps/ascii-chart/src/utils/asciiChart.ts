export interface ChartData {
  label: string;
  value: number;
}

export interface ChartOptions {
  barChar: string;
  maxWidth: number;
  showValues: boolean;
}

const DEFAULT_OPTIONS: ChartOptions = {
  barChar: '#',
  maxWidth: 40,
  showValues: true,
};

export function parseInput(input: string): ChartData[] {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const parts = line.split(',').map((s) => s.trim());
      if (parts.length < 2) return null;
      const label = parts[0];
      const value = parseFloat(parts[1]);
      if (isNaN(value)) return null;
      return { label, value };
    })
    .filter((item): item is ChartData => item !== null);
}

export function generateHorizontalChart(
  data: ChartData[],
  options: Partial<ChartOptions> = {}
): string {
  if (data.length === 0) return 'No data to display';

  const opts = { ...DEFAULT_OPTIONS, ...options };
  const maxValue = Math.max(...data.map((d) => Math.abs(d.value)));
  const maxLabelLen = Math.max(...data.map((d) => d.label.length));

  const lines: string[] = [];

  for (const item of data) {
    const barLength =
      maxValue > 0
        ? Math.round((Math.abs(item.value) / maxValue) * opts.maxWidth)
        : 0;
    const bar = opts.barChar.repeat(barLength);
    const paddedLabel = item.label.padEnd(maxLabelLen);
    const valueSuffix = opts.showValues ? ` (${item.value})` : '';
    lines.push(`${paddedLabel} | ${bar}${valueSuffix}`);
  }

  return lines.join('\n');
}

export function generateVerticalChart(
  data: ChartData[],
  options: Partial<ChartOptions> = {}
): string {
  if (data.length === 0) return 'No data to display';

  const opts = { ...DEFAULT_OPTIONS, ...options };
  const maxHeight = Math.min(opts.maxWidth, 20); // Cap vertical height
  const maxValue = Math.max(...data.map((d) => Math.abs(d.value)));
  const maxLabelLen = Math.max(...data.map((d) => d.label.length));

  const heights = data.map((d) =>
    maxValue > 0
      ? Math.round((Math.abs(d.value) / maxValue) * maxHeight)
      : 0
  );

  const lines: string[] = [];

  // Build from top to bottom
  for (let row = maxHeight; row >= 1; row--) {
    const cells: string[] = [];
    for (let col = 0; col < data.length; col++) {
      if (heights[col] >= row) {
        cells.push(` ${opts.barChar}${opts.barChar}${opts.barChar} `);
      } else {
        cells.push('     ');
      }
    }
    lines.push(cells.join(''));
  }

  // Bottom border
  lines.push('-'.repeat(data.length * 5));

  // Labels (truncate if needed)
  const labelLine = data
    .map((d) => {
      const label = d.label.substring(0, 5);
      return label.padStart(3).padEnd(5);
    })
    .join('');
  lines.push(labelLine);

  // Values
  if (opts.showValues) {
    const valueLine = data
      .map((d) => {
        const val = String(d.value);
        return val.substring(0, 5).padStart(3).padEnd(5);
      })
      .join('');
    lines.push(valueLine);
  }

  return lines.join('\n');
}
