/**
 * SCSS Formatter
 *
 * Formats and minifies SCSS code.
 * Supports SCSS-specific syntax: nesting, variables ($var), mixins (@mixin), @include, etc.
 */

interface FormatState {
  result: string;
  depth: number;
  inString: false | '"' | "'";
  inSingleLineComment: boolean;
  inMultiLineComment: boolean;
  currentLine: string;
}

const isQuoteChar = (char: string): char is '"' | "'" => char === '"' || char === "'";

const isUnescapedQuote = (code: string, i: number): boolean =>
  isQuoteChar(code[i]) && (i === 0 || code[i - 1] !== '\\');

function normalizeLine(line: string): string {
  return line.replace(/^([\w$-][\w$-]*)\s*:\s*/, '$1: ');
}

function toggleStringState(state: { inString: false | '"' | "'" }, char: string): void {
  if (!state.inString && isQuoteChar(char)) {
    state.inString = char;
  } else if (state.inString === char) {
    state.inString = false;
  }
}

function addFormattedLine(state: FormatState, indent: string): void {
  const trimmed = state.currentLine.trim();
  if (trimmed) {
    const normalized = normalizeLine(trimmed);
    state.result += `${indent.repeat(state.depth)}${normalized}\n`;
  }
  state.currentLine = '';
}

function appendOpenBrace(state: FormatState, indent: string): void {
  const lines = state.result.split('\n');
  let lastLineIndex = lines.length - 1;
  while (lastLineIndex >= 0 && !lines[lastLineIndex].trim()) {
    lastLineIndex--;
  }

  if (lastLineIndex >= 0) {
    lines[lastLineIndex] = `${lines[lastLineIndex].trimEnd()} {`;
    state.result = `${lines.join('\n')}\n`;
  } else {
    state.result += `${indent.repeat(state.depth)}{\n`;
  }
  state.depth++;
}

function appendCloseBrace(state: FormatState, indent: string): void {
  state.depth = Math.max(0, state.depth - 1);
  state.result += `${indent.repeat(state.depth)}}\n`;
  if (state.depth === 0) {
    state.result += '\n';
  }
}

function processFormatStringOrComment(
  state: FormatState,
  code: string,
  i: number,
  indent: string
): number | null {
  const char = code[i];
  const nextChar = code[i + 1];

  // String literal toggle
  if (!state.inSingleLineComment && !state.inMultiLineComment && isUnescapedQuote(code, i)) {
    toggleStringState(state, char);
    state.currentLine += char;
    return i;
  }
  if (state.inString) {
    state.currentLine += char;
    return i;
  }

  // Single-line comment
  if (!state.inMultiLineComment && char === '/' && nextChar === '/') {
    state.inSingleLineComment = true;
    state.currentLine += char;
    return i;
  }
  if (state.inSingleLineComment) {
    return processFormatSingleLineComment(state, char, indent);
  }

  // Multi-line comment
  if (!state.inMultiLineComment && char === '/' && nextChar === '*') {
    addFormattedLine(state, indent);
    state.inMultiLineComment = true;
    state.currentLine += char;
    return i;
  }
  if (state.inMultiLineComment) {
    return processFormatMultiLineComment(state, code, i, indent);
  }

  return null;
}

function processFormatSingleLineComment(state: FormatState, char: string, indent: string): number {
  if (char === '\n') {
    state.inSingleLineComment = false;
    addFormattedLine(state, indent);
  } else {
    state.currentLine += char;
  }
  return -1; // Signal: handled, use original i
}

function processFormatMultiLineComment(
  state: FormatState,
  code: string,
  i: number,
  indent: string
): number {
  const char = code[i];
  const nextChar = code[i + 1];

  state.currentLine += char;
  if (char === '*' && nextChar === '/') {
    state.currentLine += '/';
    addFormattedLine(state, indent);
    state.inMultiLineComment = false;
    return i + 1;
  }
  if (char === '\n') {
    const trimmed = state.currentLine.trim();
    if (trimmed) {
      state.result += `${indent.repeat(state.depth)} ${trimmed}\n`;
    }
    state.currentLine = '';
  }
  return i;
}

function processFormatStructural(state: FormatState, char: string, indent: string): boolean {
  if (char === '{') {
    addFormattedLine(state, indent);
    appendOpenBrace(state, indent);
    return true;
  }
  if (char === '}') {
    addFormattedLine(state, indent);
    appendCloseBrace(state, indent);
    return true;
  }
  if (char === ';') {
    state.currentLine += ';';
    addFormattedLine(state, indent);
    return true;
  }
  if (char === '\n') {
    if (state.currentLine.trim()) {
      addFormattedLine(state, indent);
    } else {
      state.currentLine = '';
    }
    return true;
  }
  return false;
}

function processFormatChar(state: FormatState, code: string, i: number, indent: string): number {
  const commentResult = processFormatStringOrComment(state, code, i, indent);
  if (commentResult !== null) {
    return commentResult === -1 ? i : commentResult;
  }

  const char = code[i];
  if (processFormatStructural(state, char, indent)) {
    return i;
  }

  state.currentLine += char;
  return i;
}

/**
 * Formats SCSS code with proper indentation and spacing.
 */
export function formatScss(code: string, indentSize = 2): string {
  if (!code.trim()) return '';

  const indent = ' '.repeat(indentSize);
  const state: FormatState = {
    result: '',
    depth: 0,
    inString: false,
    inSingleLineComment: false,
    inMultiLineComment: false,
    currentLine: '',
  };

  for (let i = 0; i < code.length; i++) {
    i = processFormatChar(state, code, i, indent);
  }

  addFormattedLine(state, indent);

  return `${state.result.replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;
}

// --- Minifier ---

interface MinifyState {
  result: string;
  inString: false | '"' | "'";
  inSingleLineComment: boolean;
  inMultiLineComment: boolean;
  lastChar: string;
}

const isWhitespace = (char: string): boolean =>
  char === ' ' || char === '\t' || char === '\n' || char === '\r';

const NO_SPACE_AFTER = new Set([' ', '{', '}', ';', ':', ',', '\n']);
const NO_SPACE_BEFORE = new Set(['{', '}', ';', ':']);

function skipWhitespace(code: string, start: number): number {
  let j = start;
  while (j < code.length && isWhitespace(code[j])) {
    j++;
  }
  return j;
}

function appendMinifyChar(state: MinifyState, char: string): void {
  state.result += char;
  state.lastChar = char;
}

function processMinifyStringOrComment(state: MinifyState, code: string, i: number): number | null {
  const char = code[i];
  const nextChar = code[i + 1];

  // String handling
  if (!state.inSingleLineComment && !state.inMultiLineComment && isUnescapedQuote(code, i)) {
    toggleStringState(state, char);
    appendMinifyChar(state, char);
    return i;
  }
  if (state.inString) {
    appendMinifyChar(state, char);
    return i;
  }

  // Single-line comment
  if (!state.inMultiLineComment && char === '/' && nextChar === '/') {
    state.inSingleLineComment = true;
    return i + 1;
  }
  if (state.inSingleLineComment) {
    if (char === '\n') state.inSingleLineComment = false;
    return i;
  }

  // Multi-line comment
  if (!state.inMultiLineComment && char === '/' && nextChar === '*') {
    state.inMultiLineComment = true;
    return i + 1;
  }
  if (state.inMultiLineComment) {
    if (char === '*' && nextChar === '/') {
      state.inMultiLineComment = false;
      return i + 1;
    }
    return i;
  }

  return null;
}

function processMinifyWhitespace(state: MinifyState, code: string, i: number): boolean {
  const char = code[i];
  if (!isWhitespace(char)) return false;

  if (state.lastChar && !NO_SPACE_AFTER.has(state.lastChar)) {
    const nextIdx = skipWhitespace(code, i + 1);
    const nextNonWs = code[nextIdx];
    if (nextNonWs && !NO_SPACE_BEFORE.has(nextNonWs)) {
      state.result += ' ';
      state.lastChar = ' ';
    }
  }
  return true;
}

function processMinifyChar(state: MinifyState, code: string, i: number): number {
  const commentResult = processMinifyStringOrComment(state, code, i);
  if (commentResult !== null) return commentResult;

  if (processMinifyWhitespace(state, code, i)) return i;

  appendMinifyChar(state, code[i]);
  return i;
}

/**
 * Minifies SCSS code by removing unnecessary whitespace and comments.
 */
export function minifyScss(code: string): string {
  if (!code.trim()) return '';

  const state: MinifyState = {
    result: '',
    inString: false,
    inSingleLineComment: false,
    inMultiLineComment: false,
    lastChar: '',
  };

  for (let i = 0; i < code.length; i++) {
    i = processMinifyChar(state, code, i);
  }

  return state.result.trim();
}
