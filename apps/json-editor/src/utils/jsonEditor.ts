export function parseJson(input: string): { value: unknown; error: string | null } {
  try {
    return { value: JSON.parse(input), error: null };
  } catch (e) {
    return { value: null, error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export function formatJson(input: string, indent: number): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, indent);
}

export function minifyJson(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

export function sortJsonKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortJsonKeys);
  }
  if (obj !== null && typeof obj === 'object') {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(obj as Record<string, unknown>).sort()) {
      sorted[key] = sortJsonKeys((obj as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return obj;
}
