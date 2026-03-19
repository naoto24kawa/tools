export interface TomlValidationResult {
  valid: boolean;
  error: string | null;
  errorLine: number | null;
  json: string | null;
  parsed: unknown;
}

class TomlError extends Error {
  line: number;
  constructor(message: string, line: number) {
    super(`Line ${line}: ${message}`);
    this.line = line;
  }
}

export function parseToml(input: string): Record<string, unknown> {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new TomlError('Empty input', 1);
  }

  const result: Record<string, unknown> = {};
  const lines = trimmed.split('\n');
  let currentTable: Record<string, unknown> = result;
  let currentPath: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i].trim();

    // Skip empty lines and comments
    if (!line || line.startsWith('#')) continue;

    // Table header [table]
    const tableMatch = line.match(/^\[([^\[\]]+)\]\s*(?:#.*)?$/);
    if (tableMatch) {
      const path = tableMatch[1].trim().split('.').map((p) => p.trim().replace(/^"|"$/g, ''));
      currentPath = path;
      currentTable = ensurePath(result, path, lineNum);
      continue;
    }

    // Array of tables [[table]]
    const arrayTableMatch = line.match(/^\[\[([^\[\]]+)\]\]\s*(?:#.*)?$/);
    if (arrayTableMatch) {
      const path = arrayTableMatch[1].trim().split('.').map((p) => p.trim().replace(/^"|"$/g, ''));
      currentPath = path;
      currentTable = ensureArrayPath(result, path, lineNum);
      continue;
    }

    // Key-value pair
    const kvMatch = line.match(/^([^=]+?)\s*=\s*(.*)/);
    if (kvMatch) {
      const key = kvMatch[1].trim().replace(/^"|"$/g, '');
      const valueStr = kvMatch[2].trim();

      if (!key) {
        throw new TomlError('Empty key', lineNum);
      }

      const value = parseTomlValue(valueStr, lineNum);
      currentTable[key] = value;
      continue;
    }

    throw new TomlError(`Unexpected content: "${line}"`, lineNum);
  }

  return result;
}

function ensurePath(
  root: Record<string, unknown>,
  path: string[],
  lineNum: number
): Record<string, unknown> {
  let current = root;
  for (const key of path) {
    if (current[key] === undefined) {
      current[key] = {};
    }
    if (typeof current[key] !== 'object' || current[key] === null || Array.isArray(current[key])) {
      // If it's an array (from [[table]]), get the last element
      if (Array.isArray(current[key])) {
        const arr = current[key] as Record<string, unknown>[];
        current = arr[arr.length - 1];
        continue;
      }
      throw new TomlError(`Cannot define table "${path.join('.')}", key already exists as non-table`, lineNum);
    }
    current = current[key] as Record<string, unknown>;
  }
  return current;
}

function ensureArrayPath(
  root: Record<string, unknown>,
  path: string[],
  lineNum: number
): Record<string, unknown> {
  let current = root;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (current[key] === undefined) {
      current[key] = {};
    }
    if (Array.isArray(current[key])) {
      const arr = current[key] as Record<string, unknown>[];
      current = arr[arr.length - 1];
    } else if (typeof current[key] === 'object' && current[key] !== null) {
      current = current[key] as Record<string, unknown>;
    } else {
      throw new TomlError(`Path conflict at "${key}"`, lineNum);
    }
  }

  const lastKey = path[path.length - 1];
  if (current[lastKey] === undefined) {
    current[lastKey] = [];
  }
  if (!Array.isArray(current[lastKey])) {
    throw new TomlError(`"${lastKey}" is not an array of tables`, lineNum);
  }

  const newTable: Record<string, unknown> = {};
  (current[lastKey] as Record<string, unknown>[]).push(newTable);
  return newTable;
}

function parseTomlValue(valueStr: string, lineNum: number): unknown {
  const trimmed = valueStr.replace(/#[^"']*$/, '').trim();

  if (!trimmed) {
    throw new TomlError('Empty value', lineNum);
  }

  // String (basic)
  if (trimmed.startsWith('"""')) {
    const endIdx = trimmed.indexOf('"""', 3);
    if (endIdx === -1) throw new TomlError('Unterminated multi-line string', lineNum);
    return trimmed.slice(3, endIdx);
  }
  if (trimmed.startsWith('"')) {
    const endIdx = findClosingQuote(trimmed, '"');
    if (endIdx === -1) throw new TomlError('Unterminated string', lineNum);
    return unescapeString(trimmed.slice(1, endIdx));
  }

  // String (literal)
  if (trimmed.startsWith("'''")) {
    const endIdx = trimmed.indexOf("'''", 3);
    if (endIdx === -1) throw new TomlError('Unterminated multi-line literal string', lineNum);
    return trimmed.slice(3, endIdx);
  }
  if (trimmed.startsWith("'")) {
    const endIdx = trimmed.indexOf("'", 1);
    if (endIdx === -1) throw new TomlError('Unterminated literal string', lineNum);
    return trimmed.slice(1, endIdx);
  }

  // Boolean
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;

  // Integer
  if (/^[+-]?\d[\d_]*$/.test(trimmed)) {
    return parseInt(trimmed.replace(/_/g, ''), 10);
  }
  if (/^0x[0-9a-fA-F_]+$/.test(trimmed)) {
    return parseInt(trimmed.replace(/_/g, ''), 16);
  }
  if (/^0o[0-7_]+$/.test(trimmed)) {
    return parseInt(trimmed.replace(/_/g, '').replace('0o', ''), 8);
  }
  if (/^0b[01_]+$/.test(trimmed)) {
    return parseInt(trimmed.replace(/_/g, '').replace('0b', ''), 2);
  }

  // Float
  if (/^[+-]?\d[\d_]*\.[\d_]+([eE][+-]?\d+)?$/.test(trimmed)) {
    return parseFloat(trimmed.replace(/_/g, ''));
  }
  if (/^[+-]?\d[\d_]*[eE][+-]?\d+$/.test(trimmed)) {
    return parseFloat(trimmed.replace(/_/g, ''));
  }
  if (trimmed === 'inf' || trimmed === '+inf') return Infinity;
  if (trimmed === '-inf') return -Infinity;
  if (trimmed === 'nan' || trimmed === '+nan' || trimmed === '-nan') return NaN;

  // Date/time (store as string)
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed;
  }
  if (/^\d{2}:\d{2}:\d{2}/.test(trimmed)) {
    return trimmed;
  }

  // Array
  if (trimmed.startsWith('[')) {
    return parseTomlArray(trimmed, lineNum);
  }

  // Inline table
  if (trimmed.startsWith('{')) {
    return parseInlineTable(trimmed, lineNum);
  }

  // Bare string (shouldn't happen in strict TOML, but be lenient)
  return trimmed;
}

function findClosingQuote(str: string, quote: string): number {
  let escape = false;
  for (let i = 1; i < str.length; i++) {
    if (escape) {
      escape = false;
      continue;
    }
    if (str[i] === '\\') {
      escape = true;
      continue;
    }
    if (str[i] === quote) return i;
  }
  return -1;
}

function unescapeString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    .replace(/\\\\/g, '\\')
    .replace(/\\"/g, '"');
}

function parseTomlArray(input: string, lineNum: number): unknown[] {
  const inner = input.slice(1, input.lastIndexOf(']')).trim();
  if (!inner) return [];

  const items: unknown[] = [];
  let current = '';
  let depth = 0;
  let inStr: string | null = null;

  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (inStr) {
      current += ch;
      if (ch === inStr && inner[i - 1] !== '\\') inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inStr = ch;
      current += ch;
      continue;
    }
    if (ch === '[' || ch === '{') { depth++; current += ch; continue; }
    if (ch === ']' || ch === '}') { depth--; current += ch; continue; }
    if (ch === ',' && depth === 0) {
      const trimmedItem = current.trim();
      if (trimmedItem) items.push(parseTomlValue(trimmedItem, lineNum));
      current = '';
      continue;
    }
    current += ch;
  }

  const last = current.trim();
  if (last) items.push(parseTomlValue(last, lineNum));

  return items;
}

function parseInlineTable(input: string, lineNum: number): Record<string, unknown> {
  const inner = input.slice(1, input.lastIndexOf('}')).trim();
  if (!inner) return {};

  const result: Record<string, unknown> = {};
  const pairs = inner.split(',');
  for (const pair of pairs) {
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) throw new TomlError(`Invalid inline table entry: "${pair.trim()}"`, lineNum);
    const key = pair.slice(0, eqIdx).trim().replace(/^"|"$/g, '');
    const value = pair.slice(eqIdx + 1).trim();
    result[key] = parseTomlValue(value, lineNum);
  }

  return result;
}

export function validateToml(input: string): TomlValidationResult {
  if (!input.trim()) {
    return { valid: false, error: 'Input is empty', errorLine: null, json: null, parsed: null };
  }

  try {
    const parsed = parseToml(input);
    const json = JSON.stringify(parsed, null, 2);
    return { valid: true, error: null, errorLine: null, json, parsed };
  } catch (e) {
    const line = e instanceof TomlError ? e.line : null;
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { valid: false, error: message, errorLine: line, json: null, parsed: null };
  }
}
