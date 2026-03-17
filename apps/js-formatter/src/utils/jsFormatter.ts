// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: character-by-character parser requires sequential branching
export function formatJs(code: string, indentSize: number = 2): string {
  if (!code.trim()) return '';

  const indent = ' '.repeat(indentSize);
  let level = 0;
  let result = '';
  let inString = false;
  let stringChar = '';
  let inSingleLineComment = false;
  let inMultiLineComment = false;
  let i = 0;

  while (i < code.length) {
    const char = code[i];
    const next = code[i + 1];

    // Handle strings
    if (!inSingleLineComment && !inMultiLineComment) {
      if (inString) {
        result += char;
        if (char === stringChar && code[i - 1] !== '\\') {
          inString = false;
        }
        i++;
        continue;
      }
      if (char === '"' || char === "'" || char === '`') {
        inString = true;
        stringChar = char;
        result += char;
        i++;
        continue;
      }
    }

    // Handle comments
    if (!inString && !inMultiLineComment && char === '/' && next === '/') {
      inSingleLineComment = true;
      result += '//';
      i += 2;
      continue;
    }
    if (inSingleLineComment && char === '\n') {
      inSingleLineComment = false;
      result += `\n${indent.repeat(level)}`;
      i++;
      continue;
    }
    if (inSingleLineComment) {
      result += char;
      i++;
      continue;
    }
    if (!inString && char === '/' && next === '*') {
      inMultiLineComment = true;
      result += '/*';
      i += 2;
      continue;
    }
    if (inMultiLineComment && char === '*' && next === '/') {
      inMultiLineComment = false;
      result += '*/';
      i += 2;
      continue;
    }
    if (inMultiLineComment) {
      result += char;
      i++;
      continue;
    }

    // Handle braces
    if (char === '{' || char === '[' || char === '(') {
      result += `${char}\n`;
      level++;
      result += indent.repeat(level);
      i++;
      while (i < code.length && (code[i] === ' ' || code[i] === '\n' || code[i] === '\t')) i++;
      continue;
    }

    if (char === '}' || char === ']' || char === ')') {
      result += '\n';
      level = Math.max(0, level - 1);
      result += indent.repeat(level) + char;
      i++;
      continue;
    }

    if (char === ';') {
      result += `;\n${indent.repeat(level)}`;
      i++;
      while (i < code.length && (code[i] === ' ' || code[i] === '\n' || code[i] === '\t')) i++;
      continue;
    }

    if (char === ',') {
      result += `,\n${indent.repeat(level)}`;
      i++;
      while (i < code.length && (code[i] === ' ' || code[i] === '\n' || code[i] === '\t')) i++;
      continue;
    }

    // Skip excessive whitespace
    if (char === ' ' || char === '\n' || char === '\t') {
      if (!result.endsWith(' ') && !result.endsWith('\n')) {
        result += ' ';
      }
      i++;
      continue;
    }

    result += char;
    i++;
  }

  // Clean up extra blank lines
  return result.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
}

export function minifyJs(code: string): string {
  return code
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*\n\s*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}()[\];,=+\-*/<>!&|?:])\s*/g, '$1')
    .trim();
}
