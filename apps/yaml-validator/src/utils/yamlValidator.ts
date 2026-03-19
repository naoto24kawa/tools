export interface YamlValidationResult {
  valid: boolean;
  error: string | null;
  errorLine: number | null;
  json: string | null;
  parsed: unknown;
}

// Simple YAML parser that handles common YAML features
export function parseYaml(input: string): unknown {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new YamlError('Empty input', 1);
  }

  const lines = trimmed.split('\n');
  return parseDocument(lines);
}

class YamlError extends Error {
  line: number;
  constructor(message: string, line: number) {
    super(`Line ${line}: ${message}`);
    this.line = line;
  }
}

function parseDocument(lines: string[]): unknown {
  // Remove comment-only lines and empty leading/trailing
  const filtered = lines.map((l, i) => ({ text: l, lineNum: i + 1 }));

  // Check for document separators
  const startIdx = filtered.findIndex((l) => l.text.trim() === '---');
  const start = startIdx >= 0 ? startIdx + 1 : 0;

  const endIdx = filtered.findIndex((l, i) => i > start && l.text.trim() === '...');
  const end = endIdx >= 0 ? endIdx : filtered.length;

  const docLines = filtered.slice(start, end);

  if (docLines.length === 0 || docLines.every((l) => !l.text.trim() || l.text.trim().startsWith('#'))) {
    return null;
  }

  // Find first non-empty, non-comment line
  const firstContent = docLines.find((l) => l.text.trim() && !l.text.trim().startsWith('#'));
  if (!firstContent) return null;

  const firstTrimmed = firstContent.text.trim();

  // Check if it's a sequence (starts with -)
  if (firstTrimmed.startsWith('- ') || firstTrimmed === '-') {
    return parseSequence(docLines, getIndent(firstContent.text));
  }

  // Check if it's a flow sequence or mapping
  if (firstTrimmed.startsWith('[')) return parseFlowSequence(firstTrimmed);
  if (firstTrimmed.startsWith('{')) return parseFlowMapping(firstTrimmed);

  // Otherwise it's a mapping or scalar
  if (firstTrimmed.includes(':')) {
    return parseMapping(docLines, getIndent(firstContent.text));
  }

  return parseScalar(firstTrimmed);
}

function getIndent(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

function parseMapping(
  lines: { text: string; lineNum: number }[],
  baseIndent: number
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.text.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      i++;
      continue;
    }

    const indent = getIndent(line.text);
    if (indent < baseIndent) break;
    if (indent > baseIndent) {
      i++;
      continue;
    }

    // Parse key: value
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) {
      throw new YamlError(`Expected key: value pair, got "${trimmed}"`, line.lineNum);
    }

    const key = trimmed.slice(0, colonIdx).trim();
    const valueStr = trimmed.slice(colonIdx + 1).trim();

    if (valueStr && !valueStr.startsWith('#')) {
      // Inline value
      if (valueStr.startsWith('[')) {
        result[key] = parseFlowSequence(valueStr);
      } else if (valueStr.startsWith('{')) {
        result[key] = parseFlowMapping(valueStr);
      } else if (valueStr === '|' || valueStr === '>') {
        // Block scalar
        const blockLines: string[] = [];
        i++;
        while (i < lines.length) {
          const bLine = lines[i];
          const bIndent = getIndent(bLine.text);
          if (bLine.text.trim() === '' || bIndent > indent) {
            blockLines.push(bLine.text.trim() ? bLine.text.slice(indent + 2) : '');
            i++;
          } else {
            break;
          }
        }
        result[key] = valueStr === '|'
          ? blockLines.join('\n')
          : blockLines.join(' ').trim();
        continue;
      } else {
        result[key] = parseScalar(valueStr);
      }
    } else {
      // Check for nested content
      const nested: { text: string; lineNum: number }[] = [];
      i++;
      while (i < lines.length) {
        const nLine = lines[i];
        const nTrimmed = nLine.text.trim();
        if (!nTrimmed || nTrimmed.startsWith('#')) {
          nested.push(nLine);
          i++;
          continue;
        }
        const nIndent = getIndent(nLine.text);
        if (nIndent <= indent) break;
        nested.push(nLine);
        i++;
      }

      if (nested.length > 0) {
        const firstNested = nested.find((l) => l.text.trim() && !l.text.trim().startsWith('#'));
        if (firstNested) {
          const nTrimmed = firstNested.text.trim();
          const nIndent = getIndent(firstNested.text);
          if (nTrimmed.startsWith('- ') || nTrimmed === '-') {
            result[key] = parseSequence(nested, nIndent);
          } else {
            result[key] = parseMapping(nested, nIndent);
          }
        } else {
          result[key] = null;
        }
      } else {
        result[key] = null;
      }
      continue;
    }

    i++;
  }

  return result;
}

function parseSequence(
  lines: { text: string; lineNum: number }[],
  baseIndent: number
): unknown[] {
  const result: unknown[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.text.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      i++;
      continue;
    }

    const indent = getIndent(line.text);
    if (indent < baseIndent) break;
    if (indent > baseIndent && !trimmed.startsWith('-')) {
      i++;
      continue;
    }

    if (trimmed.startsWith('- ')) {
      const itemValue = trimmed.slice(2).trim();
      if (itemValue.includes(':') && !itemValue.startsWith('{') && !itemValue.startsWith('[') && !itemValue.startsWith('"') && !itemValue.startsWith("'")) {
        // Inline mapping in sequence
        const subLines: { text: string; lineNum: number }[] = [
          { text: ' '.repeat(indent + 2) + itemValue, lineNum: line.lineNum },
        ];
        i++;
        while (i < lines.length) {
          const nLine = lines[i];
          const nTrimmed = nLine.text.trim();
          if (!nTrimmed || nTrimmed.startsWith('#')) { subLines.push(nLine); i++; continue; }
          const nIndent = getIndent(nLine.text);
          if (nIndent <= indent) break;
          if (nTrimmed.startsWith('- ') && nIndent === indent) break;
          subLines.push(nLine);
          i++;
        }
        result.push(parseMapping(subLines, indent + 2));
        continue;
      }
      result.push(parseScalar(itemValue));
    } else if (trimmed === '-') {
      // Empty sequence item or block
      const subLines: { text: string; lineNum: number }[] = [];
      i++;
      while (i < lines.length) {
        const nLine = lines[i];
        const nTrimmed = nLine.text.trim();
        if (!nTrimmed || nTrimmed.startsWith('#')) { subLines.push(nLine); i++; continue; }
        const nIndent = getIndent(nLine.text);
        if (nIndent <= indent) break;
        subLines.push(nLine);
        i++;
      }
      if (subLines.length > 0) {
        const firstSub = subLines.find((l) => l.text.trim() && !l.text.trim().startsWith('#'));
        if (firstSub) {
          const subIndent = getIndent(firstSub.text);
          if (firstSub.text.trim().startsWith('-')) {
            result.push(parseSequence(subLines, subIndent));
          } else {
            result.push(parseMapping(subLines, subIndent));
          }
        } else {
          result.push(null);
        }
      } else {
        result.push(null);
      }
      continue;
    }

    i++;
  }

  return result;
}

function parseFlowSequence(input: string): unknown[] {
  const inner = input.slice(1, input.lastIndexOf(']')).trim();
  if (!inner) return [];
  return inner.split(',').map((item) => parseScalar(item.trim()));
}

function parseFlowMapping(input: string): Record<string, unknown> {
  const inner = input.slice(1, input.lastIndexOf('}')).trim();
  if (!inner) return {};
  const result: Record<string, unknown> = {};
  const pairs = inner.split(',');
  for (const pair of pairs) {
    const colonIdx = pair.indexOf(':');
    if (colonIdx !== -1) {
      const key = pair.slice(0, colonIdx).trim();
      const value = pair.slice(colonIdx + 1).trim();
      result[key] = parseScalar(value);
    }
  }
  return result;
}

function parseScalar(value: string): unknown {
  // Remove inline comments
  const commentIdx = value.indexOf(' #');
  const cleaned = commentIdx !== -1 ? value.slice(0, commentIdx).trim() : value.trim();

  if (!cleaned) return null;

  // Quoted strings
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    return cleaned.slice(1, -1);
  }

  // Null
  if (cleaned === 'null' || cleaned === '~' || cleaned === 'Null' || cleaned === 'NULL') return null;

  // Boolean
  if (cleaned === 'true' || cleaned === 'True' || cleaned === 'TRUE' || cleaned === 'yes' || cleaned === 'Yes' || cleaned === 'YES' || cleaned === 'on' || cleaned === 'On' || cleaned === 'ON') return true;
  if (cleaned === 'false' || cleaned === 'False' || cleaned === 'FALSE' || cleaned === 'no' || cleaned === 'No' || cleaned === 'NO' || cleaned === 'off' || cleaned === 'Off' || cleaned === 'OFF') return false;

  // Number
  if (/^-?\d+$/.test(cleaned)) return parseInt(cleaned, 10);
  if (/^-?\d+\.\d+$/.test(cleaned)) return parseFloat(cleaned);
  if (/^0x[0-9a-fA-F]+$/.test(cleaned)) return parseInt(cleaned, 16);
  if (/^0o[0-7]+$/.test(cleaned)) return parseInt(cleaned.slice(2), 8);

  // Infinity / NaN
  if (cleaned === '.inf' || cleaned === '.Inf' || cleaned === '.INF') return Infinity;
  if (cleaned === '-.inf' || cleaned === '-.Inf' || cleaned === '-.INF') return -Infinity;
  if (cleaned === '.nan' || cleaned === '.NaN' || cleaned === '.NAN') return NaN;

  return cleaned;
}

export function validateYaml(input: string): YamlValidationResult {
  if (!input.trim()) {
    return { valid: false, error: 'Input is empty', errorLine: null, json: null, parsed: null };
  }

  try {
    const parsed = parseYaml(input);
    const json = JSON.stringify(parsed, null, 2);
    return { valid: true, error: null, errorLine: null, json, parsed };
  } catch (e) {
    const line = e instanceof YamlError ? e.line : null;
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { valid: false, error: message, errorLine: line, json: null, parsed: null };
  }
}
