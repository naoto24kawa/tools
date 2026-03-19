export type AggregationType = 'sum' | 'count' | 'avg' | 'min' | 'max';

export interface PivotConfig {
  rowField: number;
  colField: number;
  valueField: number;
  aggregation: AggregationType;
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

function aggregate(values: number[], type: AggregationType): number {
  if (values.length === 0) return 0;

  switch (type) {
    case 'sum':
      return values.reduce((a, b) => a + b, 0);
    case 'count':
      return values.length;
    case 'avg':
      return values.reduce((a, b) => a + b, 0) / values.length;
    case 'min':
      return Math.min(...values);
    case 'max':
      return Math.max(...values);
  }
}

export interface PivotResult {
  headers: string[];
  rowLabels: string[];
  data: (number | null)[][];
  rowTotals: number[];
  colTotals: number[];
  grandTotal: number;
}

export function createPivot(
  csvData: string[][],
  config: PivotConfig
): PivotResult {
  if (csvData.length < 2) {
    return { headers: [], rowLabels: [], data: [], rowTotals: [], colTotals: [], grandTotal: 0 };
  }

  const dataRows = csvData.slice(1); // Skip header

  // Collect unique row and column values
  const rowValues = new Set<string>();
  const colValues = new Set<string>();

  for (const row of dataRows) {
    rowValues.add(row[config.rowField] || '');
    colValues.add(row[config.colField] || '');
  }

  const rowLabels = [...rowValues].sort();
  const colLabels = [...colValues].sort();

  // Build grouped data
  const grouped = new Map<string, number[]>();

  for (const row of dataRows) {
    const rowKey = row[config.rowField] || '';
    const colKey = row[config.colField] || '';
    const value = parseFloat(row[config.valueField]) || 0;
    const key = `${rowKey}|||${colKey}`;

    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(value);
  }

  // Build result matrix
  const data: (number | null)[][] = [];
  const rowTotals: number[] = [];

  for (const rowLabel of rowLabels) {
    const rowData: (number | null)[] = [];
    const allRowValues: number[] = [];

    for (const colLabel of colLabels) {
      const key = `${rowLabel}|||${colLabel}`;
      const values = grouped.get(key);
      if (values && values.length > 0) {
        const result = aggregate(values, config.aggregation);
        rowData.push(Math.round(result * 100) / 100);
        allRowValues.push(...values);
      } else {
        rowData.push(null);
      }
    }

    data.push(rowData);
    rowTotals.push(
      Math.round(aggregate(allRowValues, config.aggregation) * 100) / 100
    );
  }

  // Column totals
  const colTotals: number[] = [];
  for (let c = 0; c < colLabels.length; c++) {
    const colValues: number[] = [];
    for (const rowLabel of rowLabels) {
      const key = `${rowLabel}|||${colLabels[c]}`;
      const values = grouped.get(key);
      if (values) colValues.push(...values);
    }
    colTotals.push(Math.round(aggregate(colValues, config.aggregation) * 100) / 100);
  }

  // Grand total
  const allValues = dataRows.map((r) => parseFloat(r[config.valueField]) || 0);
  const grandTotal = Math.round(aggregate(allValues, config.aggregation) * 100) / 100;

  return {
    headers: colLabels,
    rowLabels,
    data,
    rowTotals,
    colTotals,
    grandTotal,
  };
}
