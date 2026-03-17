// Simple YAML parser (handles basic key: value, lists, nested objects)
export function yamlToJson(yaml: string): string {
  try {
    const obj = parseYaml(yaml);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    throw new Error(`Invalid YAML: ${e instanceof Error ? e.message : 'parse error'}`);
  }
}

export function jsonToYaml(json: string): string {
  const obj = JSON.parse(json);
  return toYaml(obj, 0);
}

function parseYaml(yaml: string): unknown {
  const lines = yaml.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
  if (lines.length === 0) return {};
  return parseLines(lines, 0).value;
}

interface ParseResult {
  value: unknown;
  consumed: number;
}

function parseListItems(lines: string[], startIndex: number, baseIndent: number): ParseResult {
  const arr: unknown[] = [];
  let i = startIndex;
  while (
    i < lines.length &&
    lines[i].trim().startsWith('- ') &&
    getIndent(lines[i]) === baseIndent
  ) {
    arr.push(parseValue(lines[i].trim().slice(2)));
    i++;
  }
  return { value: arr, consumed: i - startIndex };
}

function parseKeyValue(
  lines: string[],
  index: number,
  baseIndent: number,
  result: Record<string, unknown>,
  trimmed: string
): number {
  const colonIndex = trimmed.indexOf(':');
  if (colonIndex <= 0) return index + 1;

  const key = trimmed.slice(0, colonIndex).trim();
  const valuePart = trimmed.slice(colonIndex + 1).trim();

  if (valuePart) {
    result[key] = parseValue(valuePart);
    return index + 1;
  }

  // Nested object or list
  const nextIndex = index + 1;
  if (nextIndex < lines.length && getIndent(lines[nextIndex]) > baseIndent) {
    const nested = parseLines(lines, nextIndex);
    result[key] = nested.value;
    return nextIndex + nested.consumed;
  }

  result[key] = null;
  return nextIndex;
}

function parseLines(lines: string[], startIndex: number): ParseResult {
  const result: Record<string, unknown> = {};
  let i = startIndex;
  const baseIndent = getIndent(lines[i] || '');

  while (i < lines.length) {
    const currentIndent = getIndent(lines[i]);
    if (currentIndent !== baseIndent) break;

    const trimmed = lines[i].trim();

    if (trimmed.startsWith('- ')) {
      return parseListItems(lines, i, baseIndent);
    }

    i = parseKeyValue(lines, i, baseIndent, result, trimmed);
  }

  return { value: result, consumed: i - startIndex };
}

function getIndent(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

function parseValue(val: string): unknown {
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (val === 'null' || val === '~') return null;
  if (/^-?\d+$/.test(val)) return Number.parseInt(val, 10);
  if (/^-?\d+\.\d+$/.test(val)) return Number.parseFloat(val);
  // Remove quotes
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1);
  }
  return val;
}

function toYaml(obj: unknown, level: number): string {
  const indent = '  '.repeat(level);

  if (obj === null || obj === undefined) return 'null';
  if (typeof obj === 'boolean') return obj.toString();
  if (typeof obj === 'number') return obj.toString();
  if (typeof obj === 'string') return obj.includes(':') || obj.includes('#') ? `"${obj}"` : obj;

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj
      .map((item) => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const inner = toYaml(item, level + 1);
          const firstLine = inner.split('\n')[0];
          const rest = inner.split('\n').slice(1).join('\n');
          return `${indent}- ${firstLine}${rest ? `\n${rest}` : ''}`;
        }
        return `${indent}- ${toYaml(item, level + 1)}`;
      })
      .join('\n');
  }

  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return entries
      .map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return `${indent}${key}:\n${toYaml(value, level + 1)}`;
        }
        return `${indent}${key}: ${toYaml(value, level + 1)}`;
      })
      .join('\n');
  }

  return String(obj);
}

export function formatYaml(yaml: string, _indentSize = 2): string {
  // Parse and re-serialize to normalize formatting
  const json = yamlToJson(yaml);
  const obj = JSON.parse(json);
  return toYaml(obj, 0);
}
