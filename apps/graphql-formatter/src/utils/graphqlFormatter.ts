/**
 * Format a GraphQL query string with proper indentation.
 */
export function formatGraphql(query: string, indentSize = 2): string {
  const trimmed = query.trim();
  if (trimmed === '') {
    return '';
  }

  const withoutComments = removeComments(trimmed);
  const tokens = tokenize(withoutComments);
  const indent = ' '.repeat(indentSize);

  return buildFormattedOutput(tokens, indent);
}

/**
 * Minify a GraphQL query by removing comments and unnecessary whitespace.
 */
export function minifyGraphql(query: string): string {
  const trimmed = query.trim();
  if (trimmed === '') {
    return '';
  }

  const withoutComments = removeComments(trimmed);
  let result = withoutComments.replace(/\s+/g, ' ');

  result = result.replace(/\s*\{\s*/g, '{');
  result = result.replace(/\s*\}\s*/g, '}');
  result = result.replace(/\s*\(\s*/g, '(');
  result = result.replace(/\s*\)\s*/g, ')');
  result = result.replace(/\s*:\s*/g, ':');
  result = result.replace(/\s*,\s*/g, ',');

  return result.trim();
}

// --- Internal helpers ---

interface FormatState {
  lines: string[];
  depth: number;
  currentLine: string;
}

function buildFormattedOutput(tokens: string[], indent: string): string {
  const state: FormatState = { lines: [], depth: 0, currentLine: '' };

  for (const token of tokens) {
    if (token === '{') {
      processOpenBrace(state, indent);
    } else if (token === '}') {
      processCloseBrace(state, indent);
    } else {
      processContent(state, token, indent);
    }
  }

  flushCurrentLine(state, indent);
  return state.lines.join('\n');
}

function pushLine(state: FormatState, content: string, depth: number, indent: string): void {
  const trimmed = content.trim();
  if (trimmed !== '') {
    state.lines.push(`${indent.repeat(depth)}${trimmed}`);
  }
}

function flushCurrentLine(state: FormatState, indent: string): void {
  if (state.currentLine.trim() !== '') {
    pushLine(state, state.currentLine, state.depth, indent);
    state.currentLine = '';
  }
}

function processOpenBrace(state: FormatState, indent: string): void {
  const prefix = state.currentLine.trim();
  state.currentLine = prefix !== '' ? `${prefix} {` : '{';
  pushLine(state, state.currentLine, state.depth, indent);
  state.currentLine = '';
  state.depth++;
}

function processCloseBrace(state: FormatState, indent: string): void {
  flushCurrentLine(state, indent);
  state.depth = Math.max(0, state.depth - 1);
  pushLine(state, '}', state.depth, indent);
}

function processContent(state: FormatState, token: string, indent: string): void {
  const value = token.trim();
  if (value === '') {
    return;
  }

  const parts = splitFields(value);
  for (const part of parts) {
    if (part.trim() === '') {
      continue;
    }
    flushCurrentLine(state, indent);
    state.currentLine = part.trim();
  }
}

/**
 * Remove # comments but preserve # inside string literals.
 */
function removeComments(input: string): string {
  let result = '';
  let inString = false;
  let i = 0;

  while (i < input.length) {
    const ch = input[i]!;

    if (inString) {
      result += ch;
      if (ch === '\\' && i + 1 < input.length) {
        i++;
        result += input[i];
      } else if (ch === '"') {
        inString = false;
      }
    } else if (ch === '"') {
      inString = true;
      result += ch;
    } else if (ch === '#') {
      i = skipToEndOfLine(input, i);
      continue;
    } else {
      result += ch;
    }

    i++;
  }

  return result;
}

function skipToEndOfLine(input: string, start: number): number {
  let i = start;
  while (i < input.length && input[i] !== '\n') {
    i++;
  }
  return i;
}

/**
 * Tokenize GraphQL into segments split by `{` and `}`.
 */
function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inString = false;
  let i = 0;

  while (i < input.length) {
    const ch = input[i]!;

    if (inString) {
      const result = handleTokenStringChar(current, input, ch, i);
      current = result.current;
      inString = result.inString;
      i = result.nextIndex;
      continue;
    }

    const result = handleTokenNonStringChar(ch, current, tokens);
    current = result.current;
    inString = result.inString;
    i++;
  }

  if (current.trim() !== '') {
    tokens.push(current);
  }

  return tokens;
}

function handleTokenStringChar(
  current: string,
  input: string,
  ch: string,
  i: number
): { current: string; inString: boolean; nextIndex: number } {
  let updated = current + ch;
  let nextIndex = i + 1;
  let inString = true;

  if (ch === '\\' && i + 1 < input.length) {
    updated += input[i + 1];
    nextIndex = i + 2;
  } else if (ch === '"') {
    inString = false;
  }

  return { current: updated, inString, nextIndex };
}

function handleTokenNonStringChar(
  ch: string,
  current: string,
  tokens: string[]
): { current: string; inString: boolean } {
  if (ch === '"') {
    return { current: current + ch, inString: true };
  }

  if (ch === '{' || ch === '}') {
    if (current.trim() !== '') {
      tokens.push(current);
    }
    tokens.push(ch);
    return { current: '', inString: false };
  }

  return { current: current + ch, inString: false };
}

/**
 * Split a text segment into individual GraphQL fields.
 */
function splitFields(segment: string): string[] {
  const fields: string[] = [];
  let current = '';
  let parenDepth = 0;
  let inString = false;
  let i = 0;

  while (i < segment.length) {
    const ch = segment[i]!;

    if (inString) {
      current = handleStringChar(current, segment, ch, i);
      if (ch === '\\') {
        i++;
      } else if (ch === '"') {
        inString = false;
      }
    } else {
      const result = handleNonStringChar(ch, current, parenDepth, segment, i, fields);
      current = result.current;
      parenDepth = result.parenDepth;
      inString = result.inString;
      if (result.skipIncrement) {
        i++;
        continue;
      }
    }

    i++;
  }

  if (current.trim() !== '') {
    fields.push(current.trim());
  }

  return fields;
}

function handleStringChar(current: string, segment: string, ch: string, i: number): string {
  let result = current + ch;
  if (ch === '\\' && i + 1 < segment.length) {
    result += segment[i + 1];
  }
  return result;
}

interface NonStringResult {
  current: string;
  parenDepth: number;
  inString: boolean;
  skipIncrement: boolean;
}

function handleNonStringChar(
  ch: string,
  current: string,
  parenDepth: number,
  segment: string,
  i: number,
  fields: string[]
): NonStringResult {
  if (ch === '"') {
    return { current: current + ch, parenDepth, inString: true, skipIncrement: false };
  }

  if (ch === '(') {
    return {
      current: current + ch,
      parenDepth: parenDepth + 1,
      inString: false,
      skipIncrement: false,
    };
  }

  if (ch === ')') {
    return {
      current: current + ch,
      parenDepth: Math.max(0, parenDepth - 1),
      inString: false,
      skipIncrement: false,
    };
  }

  if (parenDepth > 0) {
    return { current: current + ch, parenDepth, inString: false, skipIncrement: false };
  }

  if (ch === '\n' || ch === '\r') {
    return flushField(current, fields, parenDepth);
  }

  if (ch === ',') {
    return flushField(current, fields, parenDepth);
  }

  if (ch === ' ' || ch === '\t') {
    return handleWhitespace(current, segment, i, fields, parenDepth);
  }

  return { current: current + ch, parenDepth, inString: false, skipIncrement: false };
}

function flushField(current: string, fields: string[], parenDepth: number): NonStringResult {
  if (current.trim() !== '') {
    fields.push(current.trim());
  }
  return { current: '', parenDepth, inString: false, skipIncrement: false };
}

function handleWhitespace(
  current: string,
  segment: string,
  i: number,
  fields: string[],
  parenDepth: number
): NonStringResult {
  const before = current.trim();
  if (before === '' || before.endsWith(':') || isKeyword(before)) {
    return { current: current + segment[i]!, parenDepth, inString: false, skipIncrement: false };
  }

  const nextCh = findNextNonSpace(segment, i + 1);
  if (shouldSplitField(nextCh)) {
    fields.push(before);
    return { current: '', parenDepth, inString: false, skipIncrement: true };
  }

  return { current: current + segment[i]!, parenDepth, inString: false, skipIncrement: false };
}

function findNextNonSpace(segment: string, start: number): string {
  let j = start;
  while (j < segment.length && (segment[j] === ' ' || segment[j] === '\t')) {
    j++;
  }
  return j < segment.length ? segment[j]! : '';
}

function shouldSplitField(nextCh: string): boolean {
  if (nextCh === '' || nextCh === '(' || nextCh === ':' || nextCh === ',') {
    return false;
  }
  return /[a-zA-Z_.]/.test(nextCh);
}

function isKeyword(word: string): boolean {
  const keywords = ['query', 'mutation', 'subscription', 'fragment', 'on', 'type', 'input', 'enum'];
  return keywords.includes(word.toLowerCase());
}
