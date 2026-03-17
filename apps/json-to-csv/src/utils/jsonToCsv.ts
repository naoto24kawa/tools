function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function jsonToCsv(jsonStr: string, delimiter = ','): { csv: string; error: string | null } {
  if (!jsonStr.trim()) return { csv: '', error: null };

  try {
    const data = JSON.parse(jsonStr);

    if (!Array.isArray(data)) {
      return { csv: '', error: 'JSON must be an array of objects' };
    }

    if (data.length === 0) return { csv: '', error: null };

    const headers = [
      ...new Set(data.flatMap((item: Record<string, unknown>) => Object.keys(item))),
    ];
    const headerRow = headers.map(escapeCSV).join(delimiter);

    const rows = data.map((item: Record<string, unknown>) =>
      headers
        .map((h) => {
          const val = item[h];
          if (val === null || val === undefined) return '';
          if (typeof val === 'object') return escapeCSV(JSON.stringify(val));
          return escapeCSV(String(val));
        })
        .join(delimiter)
    );

    return { csv: [headerRow, ...rows].join('\n'), error: null };
  } catch (e) {
    return { csv: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}
