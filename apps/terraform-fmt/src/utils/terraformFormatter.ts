export interface FormatResult {
  formatted: string;
  changed: boolean;
  errors: string[];
}

export function formatHcl(input: string): FormatResult {
  if (!input.trim()) {
    return { formatted: '', changed: false, errors: [] };
  }

  const errors: string[] = [];
  const lines = input.split('\n');
  const result: string[] = [];
  let indentLevel = 0;
  let inHeredoc = false;
  let heredocMarker = '';
  let inMultilineComment = false;

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const rawLine = lines[lineNum];

    // Handle heredoc blocks - don't format inside them
    if (inHeredoc) {
      result.push(rawLine);
      if (rawLine.trim() === heredocMarker) {
        inHeredoc = false;
        heredocMarker = '';
      }
      continue;
    }

    // Handle multiline comments
    if (inMultilineComment) {
      result.push(rawLine);
      if (rawLine.includes('*/')) {
        inMultilineComment = false;
      }
      continue;
    }

    if (rawLine.trimStart().startsWith('/*')) {
      inMultilineComment = true;
      result.push('  '.repeat(indentLevel) + rawLine.trim());
      if (rawLine.includes('*/')) {
        inMultilineComment = false;
      }
      continue;
    }

    // Check for heredoc start
    const heredocMatch = rawLine.match(/<<-?\s*(\w+)/);
    if (heredocMatch) {
      inHeredoc = true;
      heredocMarker = heredocMatch[1];
    }

    const trimmed = rawLine.trim();

    // Empty lines
    if (!trimmed) {
      result.push('');
      continue;
    }

    // Comment lines
    if (trimmed.startsWith('#') || trimmed.startsWith('//')) {
      result.push('  '.repeat(indentLevel) + trimmed);
      continue;
    }

    // Closing braces/brackets - decrease indent before writing
    const closingOnly = /^[}\]]\s*(,?\s*)$/.test(trimmed) || trimmed === '}' || trimmed === ']';
    if (closingOnly) {
      indentLevel = Math.max(0, indentLevel - 1);
      result.push('  '.repeat(indentLevel) + trimmed);
      continue;
    }

    // Lines with closing and opening (e.g., "} else {")
    const closeAndOpen = /^[}\]]\s*\w+.*[{\[]\s*$/.test(trimmed);
    if (closeAndOpen) {
      indentLevel = Math.max(0, indentLevel - 1);
      result.push('  '.repeat(indentLevel) + trimmed);
      indentLevel++;
      continue;
    }

    // Regular line
    result.push('  '.repeat(indentLevel) + trimmed);

    // Opening braces/brackets - increase indent after writing
    // Count net braces on this line (excluding strings and comments)
    const stripped = stripStringsAndComments(trimmed);
    const opens = (stripped.match(/[{\[]/g) || []).length;
    const closes = (stripped.match(/[}\]]/g) || []).length;
    indentLevel += opens - closes;
    indentLevel = Math.max(0, indentLevel);
  }

  if (indentLevel !== 0) {
    errors.push(`Warning: Unbalanced braces/brackets (indent level: ${indentLevel})`);
  }

  // Remove trailing blank lines but keep one final newline
  while (result.length > 0 && result[result.length - 1] === '') {
    result.pop();
  }

  const formatted = result.join('\n') + '\n';
  return {
    formatted,
    changed: formatted !== input,
    errors,
  };
}

function stripStringsAndComments(line: string): string {
  let result = '';
  let inString: string | null = null;
  let escape = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (ch === '\\') {
      escape = true;
      continue;
    }

    if (inString) {
      if (ch === inString) {
        inString = null;
      }
      continue;
    }

    if (ch === '"') {
      inString = '"';
      continue;
    }

    if (ch === '#' || (ch === '/' && line[i + 1] === '/')) {
      break;
    }

    result += ch;
  }

  return result;
}
