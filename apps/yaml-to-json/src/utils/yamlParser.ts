function parseValue(value: string): unknown {
  const trimmed = value.trim();

  if (trimmed === '' || trimmed === 'null' || trimmed === '~') {
    return null;
  }
  if (trimmed === 'true' || trimmed === 'True' || trimmed === 'TRUE') {
    return true;
  }
  if (trimmed === 'false' || trimmed === 'False' || trimmed === 'FALSE') {
    return false;
  }

  // Number
  if (/^-?\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }
  if (/^-?\d+\.\d+$/.test(trimmed)) {
    return parseFloat(trimmed);
  }

  // Quoted string
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  // Inline array [a, b, c]
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inner = trimmed.slice(1, -1).trim();
    if (inner === '') return [];
    return inner.split(',').map((item) => parseValue(item.trim()));
  }

  // Inline object {a: b, c: d}
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    const inner = trimmed.slice(1, -1).trim();
    if (inner === '') return {};
    const obj: Record<string, unknown> = {};
    const pairs = inner.split(',');
    for (const pair of pairs) {
      const colonIndex = pair.indexOf(':');
      if (colonIndex !== -1) {
        const key = pair.slice(0, colonIndex).trim();
        const val = pair.slice(colonIndex + 1).trim();
        obj[key] = parseValue(val);
      }
    }
    return obj;
  }

  return trimmed;
}

interface Line {
  indent: number;
  content: string;
  lineNumber: number;
}

function getIndent(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

function parseLines(lines: Line[], startIndex: number, baseIndent: number): { value: unknown; nextIndex: number } {
  if (startIndex >= lines.length) {
    return { value: null, nextIndex: startIndex };
  }

  const currentLine = lines[startIndex];
  const content = currentLine.content;

  // Check if this is an array item
  if (content.startsWith('- ') || content === '-') {
    return parseArray(lines, startIndex, baseIndent);
  }

  // Check if this is a key-value pair
  const colonIndex = content.indexOf(':');
  if (colonIndex !== -1) {
    return parseObject(lines, startIndex, baseIndent);
  }

  // Plain value
  return { value: parseValue(content), nextIndex: startIndex + 1 };
}

function parseArray(lines: Line[], startIndex: number, baseIndent: number): { value: unknown[]; nextIndex: number } {
  const result: unknown[] = [];
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];
    if (line.indent < baseIndent) break;
    if (line.indent > baseIndent) break;

    const content = line.content;
    if (!content.startsWith('- ') && content !== '-') break;

    const itemContent = content === '-' ? '' : content.slice(2);

    if (itemContent === '' || itemContent.trim() === '') {
      // Multi-line item - check next lines
      if (i + 1 < lines.length && lines[i + 1].indent > baseIndent) {
        const { value, nextIndex } = parseLines(lines, i + 1, lines[i + 1].indent);
        result.push(value);
        i = nextIndex;
      } else {
        result.push(null);
        i++;
      }
    } else {
      // Check if item content has a key
      const colonIdx = itemContent.indexOf(':');
      if (colonIdx !== -1 && !itemContent.startsWith('{') && !itemContent.startsWith('[')) {
        const key = itemContent.slice(0, colonIdx).trim();
        const valueAfterColon = itemContent.slice(colonIdx + 1).trim();

        if (valueAfterColon === '' && i + 1 < lines.length && lines[i + 1].indent > baseIndent) {
          // Object value on next lines
          const obj: Record<string, unknown> = {};
          const { value, nextIndex } = parseLines(lines, i + 1, lines[i + 1].indent);
          obj[key] = value;

          // Check for more keys at the same sub-indent level
          let ni = nextIndex;
          while (ni < lines.length && lines[ni].indent > baseIndent) {
            const subContent = lines[ni].content;
            const subColonIdx = subContent.indexOf(':');
            if (subColonIdx !== -1) {
              const subKey = subContent.slice(0, subColonIdx).trim();
              const subVal = subContent.slice(subColonIdx + 1).trim();
              if (subVal === '' && ni + 1 < lines.length && lines[ni + 1].indent > lines[ni].indent) {
                const sub = parseLines(lines, ni + 1, lines[ni + 1].indent);
                obj[subKey] = sub.value;
                ni = sub.nextIndex;
              } else {
                obj[subKey] = parseValue(subVal);
                ni++;
              }
            } else {
              break;
            }
          }

          result.push(obj);
          i = ni;
        } else if (valueAfterColon !== '') {
          // Check for more keys following at higher indent
          const obj: Record<string, unknown> = {};
          obj[key] = parseValue(valueAfterColon);

          let ni = i + 1;
          while (ni < lines.length && lines[ni].indent > baseIndent) {
            const subContent = lines[ni].content;
            const subColonIdx = subContent.indexOf(':');
            if (subColonIdx !== -1) {
              const subKey = subContent.slice(0, subColonIdx).trim();
              const subVal = subContent.slice(subColonIdx + 1).trim();
              if (subVal === '' && ni + 1 < lines.length && lines[ni + 1].indent > lines[ni].indent) {
                const sub = parseLines(lines, ni + 1, lines[ni + 1].indent);
                obj[subKey] = sub.value;
                ni = sub.nextIndex;
              } else {
                obj[subKey] = parseValue(subVal);
                ni++;
              }
            } else {
              break;
            }
          }

          result.push(obj);
          i = ni;
        } else {
          const obj: Record<string, unknown> = {};
          obj[key] = null;
          result.push(obj);
          i++;
        }
      } else {
        result.push(parseValue(itemContent));
        i++;
      }
    }
  }

  return { value: result, nextIndex: i };
}

function parseObject(lines: Line[], startIndex: number, baseIndent: number): { value: Record<string, unknown>; nextIndex: number } {
  const result: Record<string, unknown> = {};
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];
    if (line.indent < baseIndent) break;
    if (line.indent > baseIndent) break;

    const content = line.content;
    const colonIndex = content.indexOf(':');

    if (colonIndex === -1) break;

    const key = content.slice(0, colonIndex).trim();
    const valueStr = content.slice(colonIndex + 1).trim();

    if (valueStr === '') {
      // Value on next lines
      if (i + 1 < lines.length && lines[i + 1].indent > baseIndent) {
        const { value, nextIndex } = parseLines(lines, i + 1, lines[i + 1].indent);
        result[key] = value;
        i = nextIndex;
      } else {
        result[key] = null;
        i++;
      }
    } else {
      result[key] = parseValue(valueStr);
      i++;
    }
  }

  return { value: result, nextIndex: i };
}

export function parse(yaml: string): unknown {
  if (!yaml.trim()) {
    throw new Error('Input is empty');
  }

  // Handle document separator
  const content = yaml.replace(/^---\s*$/m, '').replace(/^\.\.\.\s*$/m, '');

  const rawLines = content.split('\n');
  const lines: Line[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    // Skip empty lines and comments
    if (line.trim() === '' || line.trim().startsWith('#')) {
      continue;
    }
    lines.push({
      indent: getIndent(line),
      content: line.trim(),
      lineNumber: i + 1,
    });
  }

  if (lines.length === 0) {
    return null;
  }

  const { value } = parseLines(lines, 0, lines[0].indent);
  return value;
}
