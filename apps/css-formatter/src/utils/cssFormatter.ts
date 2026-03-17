function cleanCss(css: string): string {
  return css
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function skipWhitespace(cleaned: string, pos: number): number {
  let i = pos;
  while (i < cleaned.length && cleaned[i] === ' ') i++;
  return i;
}

interface FormatState {
  result: string;
  level: number;
  inComment: boolean;
  i: number;
}

function handleComment(cleaned: string, state: FormatState): boolean {
  const char = cleaned[state.i];
  const next = cleaned[state.i + 1];

  if (char === '/' && next === '*') {
    state.inComment = true;
    state.result += '/* ';
    state.i += 2;
    return true;
  }
  if (state.inComment && char === '*' && next === '/') {
    state.inComment = false;
    state.result += ' */\n';
    state.i += 2;
    return true;
  }
  if (state.inComment) {
    state.result += char;
    state.i++;
    return true;
  }
  return false;
}

function handleBraces(cleaned: string, state: FormatState, indent: string): boolean {
  const char = cleaned[state.i];

  if (char === '{') {
    state.result += ' {\n';
    state.level++;
    state.i++;
    state.i = skipWhitespace(cleaned, state.i);
    return true;
  }

  if (char === '}') {
    state.level = Math.max(0, state.level - 1);
    state.result += `${indent.repeat(state.level)}}\n`;
    state.i++;
    state.i = skipWhitespace(cleaned, state.i);
    if (state.i < cleaned.length && cleaned[state.i] !== '}') {
      state.result += '\n';
    }
    return true;
  }

  return false;
}

function handleSemicolon(cleaned: string, state: FormatState, indent: string): boolean {
  if (cleaned[state.i] !== ';') return false;

  state.result += ';\n';
  state.i++;
  state.i = skipWhitespace(cleaned, state.i);
  if (state.i < cleaned.length && cleaned[state.i] !== '}') {
    state.result += indent.repeat(state.level);
  }
  return true;
}

function handleChar(cleaned: string, state: FormatState, indent: string): void {
  const char = cleaned[state.i];
  if (state.result.endsWith('\n') || state.result === '') {
    if (char !== ' ') {
      state.result += `${indent.repeat(state.level)}${char}`;
    }
  } else {
    state.result += char;
  }
  state.i++;
}

export function formatCss(css: string, indentSize: number = 2): string {
  const indent = ' '.repeat(indentSize);
  const cleaned = cleanCss(css);

  const state: FormatState = {
    result: '',
    level: 0,
    inComment: false,
    i: 0,
  };

  while (state.i < cleaned.length) {
    if (handleComment(cleaned, state)) continue;
    if (handleBraces(cleaned, state, indent)) continue;
    if (handleSemicolon(cleaned, state, indent)) continue;
    handleChar(cleaned, state, indent);
  }

  return state.result.trim();
}

export function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*\n\s*/g, '')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*,\s*/g, ',')
    .trim();
}
