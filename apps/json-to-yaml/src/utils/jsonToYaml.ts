function indent(level: number): string {
  return '  '.repeat(level);
}

function valueToYaml(value: unknown, level: number): string {
  if (value === null) return 'null';
  if (value === undefined) return 'null';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    if (value.includes('\n')) {
      const lines = value.split('\n');
      return `|\n${lines.map((l) => `${indent(level + 1)}${l}`).join('\n')}`;
    }
    if (
      /[:#{}[\],&*?|>!%@`]/.test(value) ||
      value === '' ||
      value === 'true' ||
      value === 'false' ||
      value === 'null' ||
      !Number.isNaN(Number(value))
    ) {
      return `'${value.replace(/'/g, "''")}'`;
    }
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return `\n${value.map((item) => `${indent(level)}- ${valueToYaml(item, level + 1)}`).join('\n')}`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return `\n${entries.map(([k, v]) => `${indent(level)}${k}: ${valueToYaml(v, level + 1)}`).join('\n')}`;
  }
  return String(value);
}

export function jsonToYaml(jsonStr: string): { yaml: string; error: string | null } {
  if (!jsonStr.trim()) return { yaml: '', error: null };
  try {
    const parsed = JSON.parse(jsonStr);
    const yaml = valueToYaml(parsed, 0).replace(/^\n/, '');
    return { yaml, error: null };
  } catch (e) {
    return { yaml: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}
