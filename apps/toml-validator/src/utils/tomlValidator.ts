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

export function parseTOML(input: string): Record<string, unknown> {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new TomlError('Empty input', 1);
  }

  const lines = trimmed.split('\n');
  const result: Record<string, unknown> = {};
  let currentSection: Record<string, unknown> = result;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Skip empty lines and comments
    if (!line || line.startsWith('#')) {
      continue;
    }

    // Section header [section] or [section.subsection]
    if (line.startsWith('[')) {
      if (line.startsWith('[[')) {
        // Array of tables [[array]]
        const match = line.match(/^\[\[([^\]]+)\]\]\s*(?:#.*)?$/);
        if (!match) {
          throw new TomlError('Invalid array of tables syntax', lineNum);
        }
        const path = match[1].trim().split('.').map((p) => p.trim());

        // Navigate to the correct nested location
        let target = result;
        for (let p = 0; p < path.length - 1; p++) {
          const key = path[p];
          if (!(key in target)) {
            target[key] = {};
          }
          const val = target[key];
          if (Array.isArray(val)) {
            target = val[val.length - 1] as Record<string, unknown>;
          } else {
            target = val as Record<string, unknown>;
          }
        }

        const lastKey = path[path.length - 1];
        if (!(lastKey in target)) {
          target[lastKey] = [];
        }
        const arr = target[lastKey] as unknown[];
        if (!Array.isArray(arr)) {
          throw new TomlError(`"${lastKey}" is not an array`, lineNum);
        }
        const newObj: Record<string, unknown> = {};
        arr.push(newObj);
        currentSection = newObj;
      } else {
        // Regular section [section]
        const match = line.match(/^\[([^\]]+)\]\s*(?:#.*)?$/);
        if (!match) {
          throw new TomlError('Invalid section syntax', lineNum);
        }
        const path = match[1].trim().split('.').map((p) => p.trim());

        // Navigate/create nested sections
        let target = result;
        for (const key of path) {
          if (!(key in target)) {
            target[key] = {};
          }
          const val = target[key];
          if (Array.isArray(val)) {
            target = val[val.length - 1] as Record<string, unknown>;
          } else {
            target = val as Record<string, unknown>;
          }
        }
        currentSection = target;
      }
      continue;
    }

    // Key = value pair
    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) {
      throw new TomlError(`Expected key = value pair, got "${line}"`, lineNum);
    }

    const key = line.slice(0, eqIndex).trim();
    const valueStr = line.slice(eqIndex + 1).trim();

    if (!key) {
      throw new TomlError('Empty key', lineNum);
    }

    // Handle dotted keys
    const keyParts = key.split('.').map((p) => p.trim().replace(/^["']|["']$/g, ''));

    let target = currentSection;
    for (let k = 0; k < keyParts.length - 1; k++) {
      const part = keyParts[k];
      if (!(part in target)) {
        target[part] = {};
      }
      target = target[part] as Record<string, unknown>;
    }

    const finalKey = keyParts[keyParts.length - 1];
    try {
      target[finalKey] = parseValue(valueStr, lineNum);
    } catch (e) {
      if (e instanceof TomlError) throw e;
      throw new TomlError(`Invalid value: ${valueStr}`, lineNum);
    }
  }

  return result;
}

function parseValue(input: string, lineNum: number): unknown {
  // Remove inline comments (but not inside strings)
  let value = input;
  if (!value.startsWith('"') && !value.startsWith("'")) {
    const commentIdx = value.indexOf(' #');
    if (commentIdx !== -1) {
      value = value.slice(0, commentIdx).trim();
    }
  }

  if (!value) {
    throw new TomlError('Empty value', lineNum);
  }

  // String: basic (double-quoted)
  if (value.startsWith('"""')) {
    const endIdx = value.indexOf('"""', 3);
    if (endIdx === -1) {
      throw new TomlError('Unterminated multi-line string', lineNum);
    }
    return value.slice(3, endIdx);
  }

  if (value.startsWith('"')) {
    const endIdx = findClosingQuote(value, '"');
    if (endIdx === -1) {
      throw new TomlError('Unterminated string', lineNum);
    }
    return unescapeString(value.slice(1, endIdx));
  }

  // String: literal (single-quoted)
  if (value.startsWith("'''")) {
    const endIdx = value.indexOf("'''", 3);
    if (endIdx === -1) {
      throw new TomlError('Unterminated multi-line literal string', lineNum);
    }
    return value.slice(3, endIdx);
  }

  if (value.startsWith("'")) {
    const endIdx = value.indexOf("'", 1);
    if (endIdx === -1) {
      throw new TomlError('Unterminated literal string', lineNum);
    }
    return value.slice(1, endIdx);
  }

  // Array
  if (value.startsWith('[')) {
    return parseArray(value, lineNum);
  }

  // Inline table
  if (value.startsWith('{')) {
    return parseInlineTable(value, lineNum);
  }

  // Remove trailing comment for bare values
  const bareValue = value.replace(/\s*#.*$/, '').trim();

  // Boolean
  if (bareValue === 'true') return true;
  if (bareValue === 'false') return false;

  // Integer
  if (/^[+-]?\d[\d_]*$/.test(bareValue)) {
    return parseInt(bareValue.replace(/_/g, ''), 10);
  }

  // Hex integer
  if (/^0x[0-9a-fA-F_]+$/.test(bareValue)) {
    return parseInt(bareValue.replace(/_/g, ''), 16);
  }

  // Octal integer
  if (/^0o[0-7_]+$/.test(bareValue)) {
    return parseInt(bareValue.replace(/_/g, '').replace('0o', ''), 8);
  }

  // Binary integer
  if (/^0b[01_]+$/.test(bareValue)) {
    return parseInt(bareValue.replace(/_/g, '').replace('0b', ''), 2);
  }

  // Float
  if (/^[+-]?\d[\d_]*\.[\d_]+([eE][+-]?\d+)?$/.test(bareValue)) {
    return parseFloat(bareValue.replace(/_/g, ''));
  }

  // Float with exponent only
  if (/^[+-]?\d[\d_]*[eE][+-]?\d+$/.test(bareValue)) {
    return parseFloat(bareValue.replace(/_/g, ''));
  }

  // Special float values
  if (bareValue === 'inf' || bareValue === '+inf') return Infinity;
  if (bareValue === '-inf') return -Infinity;
  if (bareValue === 'nan' || bareValue === '+nan' || bareValue === '-nan') return NaN;

  // Date/time (return as string)
  if (/^\d{4}-\d{2}-\d{2}/.test(bareValue)) {
    return bareValue;
  }

  // Time
  if (/^\d{2}:\d{2}:\d{2}/.test(bareValue)) {
    return bareValue;
  }

  throw new TomlError(`Invalid value: "${bareValue}"`, lineNum);
}

function findClosingQuote(input: string, quote: string): number {
  let i = 1;
  while (i < input.length) {
    if (input[i] === '\\') {
      i += 2;
      continue;
    }
    if (input[i] === quote) {
      return i;
    }
    i++;
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

function parseArray(input: string, lineNum: number): unknown[] {
  const inner = input.slice(1, input.lastIndexOf(']')).trim();
  if (!inner) return [];

  const items: unknown[] = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];

    if (inString) {
      current += ch;
      if (ch === '\\') {
        i++;
        if (i < inner.length) current += inner[i];
        continue;
      }
      if (ch === stringChar) {
        inString = false;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      stringChar = ch;
      current += ch;
    } else if (ch === '[' || ch === '{') {
      depth++;
      current += ch;
    } else if (ch === ']' || ch === '}') {
      depth--;
      current += ch;
    } else if (ch === ',' && depth === 0) {
      const trimmed = current.trim();
      if (trimmed) {
        items.push(parseValue(trimmed, lineNum));
      }
      current = '';
    } else if (ch === '#' && depth === 0) {
      // Skip rest of line as comment
      break;
    } else {
      current += ch;
    }
  }

  const trimmed = current.trim();
  if (trimmed) {
    items.push(parseValue(trimmed, lineNum));
  }

  return items;
}

function parseInlineTable(input: string, lineNum: number): Record<string, unknown> {
  const inner = input.slice(1, input.lastIndexOf('}')).trim();
  if (!inner) return {};

  const result: Record<string, unknown> = {};
  const pairs = splitInlineTable(inner);

  for (const pair of pairs) {
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) {
      throw new TomlError(`Invalid inline table entry: "${pair}"`, lineNum);
    }
    const key = pair.slice(0, eqIdx).trim();
    const val = pair.slice(eqIdx + 1).trim();
    result[key] = parseValue(val, lineNum);
  }

  return result;
}

function splitInlineTable(input: string): string[] {
  const parts: string[] = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (inString) {
      current += ch;
      if (ch === '\\') {
        i++;
        if (i < input.length) current += input[i];
        continue;
      }
      if (ch === stringChar) {
        inString = false;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      stringChar = ch;
      current += ch;
    } else if (ch === '{' || ch === '[') {
      depth++;
      current += ch;
    } else if (ch === '}' || ch === ']') {
      depth--;
      current += ch;
    } else if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

export function validateTOML(input: string): TomlValidationResult {
  if (!input.trim()) {
    return { valid: false, error: 'Input is empty', errorLine: null, json: null, parsed: null };
  }

  try {
    const parsed = parseTOML(input);
    const json = JSON.stringify(parsed, null, 2);
    return { valid: true, error: null, errorLine: null, json, parsed };
  } catch (e) {
    const line = e instanceof TomlError ? e.line : null;
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { valid: false, error: message, errorLine: line, json: null, parsed: null };
  }
}
