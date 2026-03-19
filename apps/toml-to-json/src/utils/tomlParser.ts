function parseTomlValue(value: string): unknown {
  const trimmed = value.trim();

  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;

  // String (basic)
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed
      .slice(1, -1)
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }

  // String (literal)
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1);
  }

  // Array
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return parseTomlArray(trimmed);
  }

  // Inline table
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return parseInlineTable(trimmed);
  }

  // Date/datetime (ISO 8601)
  if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(trimmed)) {
    return trimmed;
  }

  // Float
  if (/^[+-]?\d+\.\d+([eE][+-]?\d+)?$/.test(trimmed)) {
    return parseFloat(trimmed);
  }

  // Integer (with underscores)
  if (/^[+-]?\d[\d_]*$/.test(trimmed)) {
    return parseInt(trimmed.replace(/_/g, ''), 10);
  }

  // Hex
  if (/^0x[0-9a-fA-F_]+$/.test(trimmed)) {
    return parseInt(trimmed.replace(/_/g, ''), 16);
  }

  // Octal
  if (/^0o[0-7_]+$/.test(trimmed)) {
    return parseInt(trimmed.replace(/_/g, '').replace('0o', ''), 8);
  }

  // Binary
  if (/^0b[01_]+$/.test(trimmed)) {
    return parseInt(trimmed.replace(/_/g, '').replace('0b', ''), 2);
  }

  // Special floats
  if (trimmed === 'inf' || trimmed === '+inf') return Infinity;
  if (trimmed === '-inf') return -Infinity;
  if (trimmed === 'nan' || trimmed === '+nan' || trimmed === '-nan') return NaN;

  return trimmed;
}

function parseTomlArray(str: string): unknown[] {
  const inner = str.slice(1, -1).trim();
  if (inner === '') return [];

  const items: unknown[] = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < inner.length; i++) {
    const char = inner[i];

    if (inString) {
      current += char;
      if (char === stringChar && inner[i - 1] !== '\\') {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      stringChar = char;
      current += char;
    } else if (char === '[' || char === '{') {
      depth++;
      current += char;
    } else if (char === ']' || char === '}') {
      depth--;
      current += char;
    } else if (char === ',' && depth === 0) {
      const trimmed = current.trim();
      if (trimmed !== '') {
        items.push(parseTomlValue(trimmed));
      }
      current = '';
    } else {
      current += char;
    }
  }

  const trimmed = current.trim();
  if (trimmed !== '') {
    items.push(parseTomlValue(trimmed));
  }

  return items;
}

function parseInlineTable(str: string): Record<string, unknown> {
  const inner = str.slice(1, -1).trim();
  if (inner === '') return {};

  const result: Record<string, unknown> = {};
  const pairs = splitTopLevel(inner, ',');

  for (const pair of pairs) {
    const eqIndex = pair.indexOf('=');
    if (eqIndex !== -1) {
      const key = pair.slice(0, eqIndex).trim();
      const value = pair.slice(eqIndex + 1).trim();
      result[key] = parseTomlValue(value);
    }
  }

  return result;
}

function splitTopLevel(str: string, separator: string): string[] {
  const parts: string[] = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (inString) {
      current += char;
      if (char === stringChar && str[i - 1] !== '\\') {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      stringChar = char;
      current += char;
    } else if (char === '[' || char === '{') {
      depth++;
      current += char;
    } else if (char === ']' || char === '}') {
      depth--;
      current += char;
    } else if (char === separator && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim() !== '') {
    parts.push(current.trim());
  }

  return parts;
}

function setNestedValue(obj: Record<string, unknown>, keys: string[], value: unknown): void {
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
}

function getNestedObject(obj: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  let current = obj;
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  return current;
}

function parseKeyName(key: string): string {
  const trimmed = key.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseDottedKey(key: string): string[] {
  const parts: string[] = [];
  let current = '';
  let inQuote = false;
  let quoteChar = '';

  for (let i = 0; i < key.length; i++) {
    const char = key[i];
    if (inQuote) {
      if (char === quoteChar) {
        inQuote = false;
        current += char;
      } else {
        current += char;
      }
    } else if (char === '"' || char === "'") {
      inQuote = true;
      quoteChar = char;
      current += char;
    } else if (char === '.') {
      parts.push(parseKeyName(current));
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim() !== '') {
    parts.push(parseKeyName(current));
  }
  return parts;
}

export function parse(toml: string): Record<string, unknown> {
  if (!toml.trim()) {
    throw new Error('Input is empty');
  }

  const result: Record<string, unknown> = {};
  let currentSection = result;
  const lines = toml.split('\n');
  let i = 0;

  while (i < lines.length) {
    let line = lines[i].trim();
    i++;

    // Skip empty lines and comments
    if (line === '' || line.startsWith('#')) {
      continue;
    }

    // Remove inline comments (not inside strings)
    const commentIndex = findInlineComment(line);
    if (commentIndex !== -1) {
      line = line.slice(0, commentIndex).trim();
    }

    // Array of tables [[section]]
    if (line.startsWith('[[') && line.endsWith(']]')) {
      const sectionName = line.slice(2, -2).trim();
      const keys = parseDottedKey(sectionName);
      const parentKeys = keys.slice(0, -1);
      const lastKey = keys[keys.length - 1];
      const parent = parentKeys.length > 0 ? getNestedObject(result, parentKeys) : result;

      if (!(lastKey in parent)) {
        parent[lastKey] = [];
      }
      const arr = parent[lastKey] as unknown[];
      const newObj: Record<string, unknown> = {};
      arr.push(newObj);
      currentSection = newObj;
      continue;
    }

    // Table [section]
    if (line.startsWith('[') && line.endsWith(']')) {
      const sectionName = line.slice(1, -1).trim();
      const keys = parseDottedKey(sectionName);
      currentSection = getNestedObject(result, keys);
      continue;
    }

    // Key-value pair
    const eqIndex = line.indexOf('=');
    if (eqIndex !== -1) {
      const rawKey = line.slice(0, eqIndex).trim();
      let value = line.slice(eqIndex + 1).trim();

      // Multi-line basic string
      if (value === '"""' || value.startsWith('"""')) {
        if (value === '"""' || !value.slice(3).includes('"""')) {
          let multiline = value === '"""' ? '' : value.slice(3);
          while (i < lines.length) {
            const nextLine = lines[i];
            i++;
            if (nextLine.includes('"""')) {
              multiline += '\n' + nextLine.slice(0, nextLine.indexOf('"""'));
              break;
            }
            multiline += '\n' + nextLine;
          }
          value = '"' + multiline.replace(/^\n/, '') + '"';
        }
      }

      // Multi-line literal string
      if (value === "'''" || value.startsWith("'''")) {
        if (value === "'''" || !value.slice(3).includes("'''")) {
          let multiline = value === "'''" ? '' : value.slice(3);
          while (i < lines.length) {
            const nextLine = lines[i];
            i++;
            if (nextLine.includes("'''")) {
              multiline += '\n' + nextLine.slice(0, nextLine.indexOf("'''"));
              break;
            }
            multiline += '\n' + nextLine;
          }
          value = "'" + multiline.replace(/^\n/, '') + "'";
        }
      }

      // Multi-line array
      if (value.startsWith('[') && !value.endsWith(']')) {
        while (i < lines.length && !value.includes(']')) {
          const nextLine = lines[i].trim();
          i++;
          if (nextLine === '' || nextLine.startsWith('#')) continue;
          value += ' ' + nextLine;
        }
      }

      const keys = parseDottedKey(rawKey);
      const parsedValue = parseTomlValue(value);

      if (keys.length === 1) {
        currentSection[keys[0]] = parsedValue;
      } else {
        setNestedValue(currentSection, keys, parsedValue);
      }
    }
  }

  return result;
}

function findInlineComment(line: string): number {
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inString) {
      if (char === stringChar && line[i - 1] !== '\\') {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      stringChar = char;
    } else if (char === '#') {
      // Check it's preceded by whitespace
      if (i > 0 && (line[i - 1] === ' ' || line[i - 1] === '\t')) {
        return i;
      }
    }
  }

  return -1;
}
