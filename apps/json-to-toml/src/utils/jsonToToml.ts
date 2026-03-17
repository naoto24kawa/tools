function escapeTomlString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

function valueToToml(value: unknown): string {
  if (value === null || value === undefined) return '""';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return `"${escapeTomlString(value)}"`;
  if (Array.isArray(value)) {
    const items = value.map(valueToToml).join(', ');
    return `[${items}]`;
  }
  return '""';
}

function objectToToml(obj: Record<string, unknown>, prefix: string): string {
  const lines: string[] = [];
  const tables: [string, Record<string, unknown>][] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      tables.push([key, value as Record<string, unknown>]);
    } else {
      lines.push(`${key} = ${valueToToml(value)}`);
    }
  }

  for (const [key, table] of tables) {
    const section = prefix ? `${prefix}.${key}` : key;
    lines.push('');
    lines.push(`[${section}]`);
    lines.push(objectToToml(table, section));
  }

  return lines.join('\n');
}

export function jsonToToml(jsonStr: string): { toml: string; error: string | null } {
  if (!jsonStr.trim()) return { toml: '', error: null };
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { toml: '', error: 'TOML root must be an object' };
    }
    return { toml: objectToToml(parsed as Record<string, unknown>, '').trim(), error: null };
  } catch (e) {
    return { toml: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}
