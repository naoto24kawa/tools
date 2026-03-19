export type SamplingMethod = 'random' | 'systematic' | 'stratified';

export interface SampleConfig {
  method: SamplingMethod;
  sampleSize: number;
  stratifyColumn?: number;
  seed?: number;
}

export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(current.trim());
        current = '';
      } else if (char === '\n' || (char === '\r' && text[i + 1] === '\n')) {
        row.push(current.trim());
        if (row.some((c) => c !== '')) rows.push(row);
        row = [];
        current = '';
        if (char === '\r') i++;
      } else {
        current += char;
      }
    }
  }

  row.push(current.trim());
  if (row.some((c) => c !== '')) rows.push(row);

  return rows;
}

export function parseJSON(text: string): string[][] {
  const data = JSON.parse(text);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('JSON must be an array of objects');
  }

  const keys = Object.keys(data[0]);
  const rows: string[][] = [keys];

  for (const item of data) {
    rows.push(keys.map((k) => String(item[k] ?? '')));
  }

  return rows;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function randomSample(
  data: string[][],
  size: number,
  hasHeader: boolean,
  seed?: number
): string[][] {
  const header = hasHeader ? data[0] : undefined;
  const rows = hasHeader ? data.slice(1) : data;
  const n = Math.min(size, rows.length);

  const rand = seed !== undefined ? seededRandom(seed) : Math.random;

  // Fisher-Yates shuffle (partial)
  const indices = rows.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const sampled = indices.slice(0, n).sort((a, b) => a - b).map((i) => rows[i]);
  return header ? [header, ...sampled] : sampled;
}

export function systematicSample(
  data: string[][],
  size: number,
  hasHeader: boolean
): string[][] {
  const header = hasHeader ? data[0] : undefined;
  const rows = hasHeader ? data.slice(1) : data;
  const n = Math.min(size, rows.length);

  const interval = Math.max(1, Math.floor(rows.length / n));
  const sampled: string[][] = [];

  for (let i = 0; i < rows.length && sampled.length < n; i += interval) {
    sampled.push(rows[i]);
  }

  return header ? [header, ...sampled] : sampled;
}

export function stratifiedSample(
  data: string[][],
  size: number,
  stratifyCol: number,
  hasHeader: boolean,
  seed?: number
): string[][] {
  const header = hasHeader ? data[0] : undefined;
  const rows = hasHeader ? data.slice(1) : data;

  // Group by stratify column
  const groups = new Map<string, string[][]>();
  for (const row of rows) {
    const key = row[stratifyCol] || '(empty)';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(row);
  }

  // Proportional allocation
  const sampled: string[][] = [];
  const rand = seed !== undefined ? seededRandom(seed) : Math.random;

  for (const [, groupRows] of groups) {
    const groupSize = Math.max(1, Math.round((groupRows.length / rows.length) * size));
    const n = Math.min(groupSize, groupRows.length);

    const indices = groupRows.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    for (let i = 0; i < n; i++) {
      sampled.push(groupRows[indices[i]]);
    }
  }

  return header ? [header, ...sampled.slice(0, size)] : sampled.slice(0, size);
}

export function sample(
  data: string[][],
  config: SampleConfig,
  hasHeader: boolean
): string[][] {
  switch (config.method) {
    case 'random':
      return randomSample(data, config.sampleSize, hasHeader, config.seed);
    case 'systematic':
      return systematicSample(data, config.sampleSize, hasHeader);
    case 'stratified':
      return stratifiedSample(
        data,
        config.sampleSize,
        config.stratifyColumn || 0,
        hasHeader,
        config.seed
      );
  }
}

export function toCSVString(data: string[][]): string {
  return data
    .map((row) =>
      row
        .map((cell) => {
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return '"' + cell.replace(/"/g, '""') + '"';
          }
          return cell;
        })
        .join(',')
    )
    .join('\n');
}
