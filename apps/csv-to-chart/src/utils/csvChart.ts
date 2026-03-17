export interface ChartData {
  labels: string[];
  datasets: { label: string; values: number[] }[];
}

export function parseCSV(csv: string, delimiter = ','): ChartData {
  const lines = csv
    .trim()
    .split('\n')
    .filter((l) => l.trim());
  if (lines.length < 2) return { labels: [], datasets: [] };

  const headers = lines[0].split(delimiter).map((h) => h.trim());
  const labels: string[] = [];
  const dataColumns: number[][] = Array.from({ length: headers.length - 1 }, () => []);

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(delimiter).map((c) => c.trim());
    labels.push(cols[0] ?? '');
    for (let j = 1; j < headers.length; j++) {
      dataColumns[j - 1]?.push(Number(cols[j]) || 0);
    }
  }

  const datasets = headers.slice(1).map((label, i) => ({
    label,
    values: dataColumns[i] ?? [],
  }));

  return { labels, datasets };
}

export function getMaxValue(data: ChartData): number {
  let max = 0;
  for (const ds of data.datasets) {
    for (const v of ds.values) {
      if (v > max) max = v;
    }
  }
  return max || 1;
}
