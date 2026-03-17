export interface TableData {
  headers: string[];
  rows: string[][];
  error: string | null;
}

export function jsonToTable(jsonStr: string): TableData {
  if (!jsonStr.trim()) return { headers: [], rows: [], error: null };
  try {
    const data = JSON.parse(jsonStr);
    if (!Array.isArray(data))
      return { headers: [], rows: [], error: 'JSON must be an array of objects' };
    if (data.length === 0) return { headers: [], rows: [], error: null };

    const headers = [
      ...new Set(data.flatMap((item: Record<string, unknown>) => Object.keys(item))),
    ];
    const rows = data.map((item: Record<string, unknown>) =>
      headers.map((h) => {
        const val = item[h];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
      })
    );

    return { headers, rows, error: null };
  } catch (e) {
    return { headers: [], rows: [], error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}
