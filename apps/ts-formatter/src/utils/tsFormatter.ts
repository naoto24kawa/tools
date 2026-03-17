/**
 * TypeScript/JavaScript formatter utility.
 *
 * TypeScript formatting is essentially the same as JavaScript formatting.
 * Both languages share the same brace/semicolon/comma-based structure,
 * so we reuse the same formatting logic for both.
 */

/** Parser state tracking for string/comment contexts. */
interface ParserState {
  inSingleQuote: boolean;
  inDoubleQuote: boolean;
  inTemplateLiteral: boolean;
  inSingleLineComment: boolean;
  inMultiLineComment: boolean;
}

function createParserState(): ParserState {
  return {
    inSingleQuote: false,
    inDoubleQuote: false,
    inTemplateLiteral: false,
    inSingleLineComment: false,
    inMultiLineComment: false,
  };
}

function isInString(s: ParserState): boolean {
  return s.inSingleQuote || s.inDoubleQuote || s.inTemplateLiteral;
}

/** Skip whitespace starting at position i, return new position. */
function skipWhitespace(code: string, start: number, pattern: RegExp): number {
  let i = start;
  while (i < code.length && pattern.test(code[i])) i++;
  return i;
}

/** Handle escape character in a string, appending to result. Returns chars consumed. */
function handleEscape(code: string, i: number): { text: string; consumed: number } {
  if (i + 1 < code.length) {
    return { text: code[i] + code[i + 1], consumed: 2 };
  }
  return { text: code[i], consumed: 1 };
}

/** Try to close a string quote. Returns true if the char ended the string. */
function tryCloseString(state: ParserState, ch: string): boolean {
  if (state.inSingleQuote && ch === "'") {
    state.inSingleQuote = false;
    return true;
  }
  if (state.inDoubleQuote && ch === '"') {
    state.inDoubleQuote = false;
    return true;
  }
  if (state.inTemplateLiteral && ch === '`') {
    state.inTemplateLiteral = false;
    return true;
  }
  return false;
}

/** Try to open a string quote. Returns true if a string was started. */
function tryOpenString(state: ParserState, ch: string): boolean {
  if (ch === "'") {
    state.inSingleQuote = true;
    return true;
  }
  if (ch === '"') {
    state.inDoubleQuote = true;
    return true;
  }
  if (ch === '`') {
    state.inTemplateLiteral = true;
    return true;
  }
  return false;
}

/** Try to start a comment. Returns chars consumed (0 if not a comment start). */
function tryStartComment(state: ParserState, ch: string, next: string): number {
  if (ch === '/' && next === '/') {
    state.inSingleLineComment = true;
    return 2;
  }
  if (ch === '/' && next === '*') {
    state.inMultiLineComment = true;
    return 2;
  }
  return 0;
}

/** Clean up result lines: trim trailing whitespace, remove consecutive blank lines. */
function cleanupResult(raw: string): string {
  return raw
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line, idx, arr) => {
      if (line === '' && idx > 0 && arr[idx - 1] === '') return false;
      return true;
    })
    .join('\n')
    .trim();
}

// --- Format helpers ---

interface FormatContext {
  code: string;
  indent: string;
  state: ParserState;
  result: string;
  depth: number;
  i: number;
}

function addNewline(ctx: FormatContext): void {
  ctx.result = ctx.result.trimEnd();
  ctx.result += `\n${ctx.indent.repeat(ctx.depth)}`;
}

function formatSingleLineComment(ctx: FormatContext): void {
  const ch = ctx.code[ctx.i];
  if (ch === '\n') {
    ctx.state.inSingleLineComment = false;
    ctx.result += ch;
    ctx.result += ctx.indent.repeat(ctx.depth);
  } else {
    ctx.result += ch;
  }
  ctx.i++;
}

function formatMultiLineComment(ctx: FormatContext): void {
  const ch = ctx.code[ctx.i];
  const next = ctx.i + 1 < ctx.code.length ? ctx.code[ctx.i + 1] : '';
  ctx.result += ch;
  if (ch === '*' && next === '/') {
    ctx.result += next;
    ctx.state.inMultiLineComment = false;
    ctx.i += 2;
  } else {
    ctx.i++;
  }
}

function formatStringChar(ctx: FormatContext): void {
  const ch = ctx.code[ctx.i];
  if (ch === '\\') {
    const esc = handleEscape(ctx.code, ctx.i);
    ctx.result += esc.text;
    ctx.i += esc.consumed;
    return;
  }
  tryCloseString(ctx.state, ch);
  ctx.result += ch;
  ctx.i++;
}

function formatOpenBrace(ctx: FormatContext): void {
  ctx.result = ctx.result.trimEnd();
  ctx.result += ' {';
  ctx.depth++;
  addNewline(ctx);
  ctx.i++;
  ctx.i = skipWhitespace(ctx.code, ctx.i, /\s/);
}

function formatCloseBrace(ctx: FormatContext): void {
  ctx.depth = Math.max(0, ctx.depth - 1);
  addNewline(ctx);
  ctx.result += '}';
  ctx.i++;

  const lookAhead = skipWhitespace(ctx.code, ctx.i, /\s/);
  const remaining = ctx.code.slice(lookAhead);
  if (
    remaining.startsWith('else') ||
    remaining.startsWith('catch') ||
    remaining.startsWith('finally')
  ) {
    ctx.result += ' ';
    ctx.i = lookAhead;
    return;
  }

  ctx.i = skipWhitespace(ctx.code, ctx.i, / /);
  if (ctx.i < ctx.code.length && ctx.code[ctx.i] === '\n') ctx.i++;
  if (
    ctx.i < ctx.code.length &&
    ctx.code[ctx.i] !== '}' &&
    ctx.code[ctx.i] !== ';' &&
    ctx.code[ctx.i] !== ','
  ) {
    addNewline(ctx);
  }
}

function formatSemicolon(ctx: FormatContext): void {
  ctx.result += ';';
  ctx.i++;
  ctx.i = skipWhitespace(ctx.code, ctx.i, /[ \t]/);
  if (ctx.i < ctx.code.length && ctx.code[ctx.i] === '\n') {
    ctx.i++;
    if (ctx.i < ctx.code.length && ctx.code[ctx.i] !== '}') {
      addNewline(ctx);
    }
  } else if (ctx.i < ctx.code.length && ctx.code[ctx.i] !== '}') {
    addNewline(ctx);
  }
}

function formatComma(ctx: FormatContext): void {
  ctx.result += ',';
  ctx.i++;
  if (ctx.depth > 0) {
    ctx.i = skipWhitespace(ctx.code, ctx.i, /[ \t]/);
    if (ctx.i < ctx.code.length && ctx.code[ctx.i] === '\n') ctx.i++;
    addNewline(ctx);
  } else {
    if (ctx.i < ctx.code.length && /\s/.test(ctx.code[ctx.i])) {
      ctx.i = skipWhitespace(ctx.code, ctx.i, /\s/);
      ctx.result += ' ';
    }
  }
}

function formatWhitespace(ctx: FormatContext): void {
  ctx.i = skipWhitespace(ctx.code, ctx.i, /\s/);
  if (ctx.result.length > 0 && !/\s/.test(ctx.result[ctx.result.length - 1])) {
    ctx.result += ' ';
  }
}

/** Handle context-aware chars (comments, strings). Returns true if handled. */
function handleFormatContextChar(ctx: FormatContext): boolean {
  if (ctx.state.inSingleLineComment) {
    formatSingleLineComment(ctx);
    return true;
  }
  if (ctx.state.inMultiLineComment) {
    formatMultiLineComment(ctx);
    return true;
  }
  if (isInString(ctx.state)) {
    formatStringChar(ctx);
    return true;
  }
  return false;
}

/** Handle structural chars ({, }, ;, ,, whitespace). Returns true if handled. */
function handleFormatStructuralChar(ctx: FormatContext, ch: string): boolean {
  const handlers: Record<string, (c: FormatContext) => void> = {
    '{': formatOpenBrace,
    '}': formatCloseBrace,
    ';': formatSemicolon,
    ',': formatComma,
  };
  const handler = handlers[ch];
  if (handler) {
    handler(ctx);
    return true;
  }
  if (/\s/.test(ch)) {
    formatWhitespace(ctx);
    return true;
  }
  return false;
}

/**
 * Format TypeScript/JavaScript code with proper indentation and newlines.
 */
export function formatTs(code: string, indentSize = 2): string {
  if (!code.trim()) return '';

  const ctx: FormatContext = {
    code,
    indent: ' '.repeat(indentSize),
    state: createParserState(),
    result: '',
    depth: 0,
    i: 0,
  };

  while (ctx.i < code.length) {
    const ch = code[ctx.i];
    const next = ctx.i + 1 < code.length ? code[ctx.i + 1] : '';

    if (handleFormatContextChar(ctx)) continue;

    const commentLen = tryStartComment(ctx.state, ch, next);
    if (commentLen > 0) {
      ctx.result += code.slice(ctx.i, ctx.i + commentLen);
      ctx.i += commentLen;
      continue;
    }
    if (tryOpenString(ctx.state, ch)) {
      ctx.result += ch;
      ctx.i++;
      continue;
    }

    if (handleFormatStructuralChar(ctx, ch)) continue;

    ctx.result += ch;
    ctx.i++;
  }

  return cleanupResult(ctx.result);
}

// --- Minify helpers ---

interface MinifyContext {
  code: string;
  state: ParserState;
  result: string;
  i: number;
}

function minifySingleLineComment(ctx: MinifyContext): void {
  if (ctx.code[ctx.i] === '\n') {
    ctx.state.inSingleLineComment = false;
  }
  ctx.i++;
}

function minifyMultiLineComment(ctx: MinifyContext): void {
  const ch = ctx.code[ctx.i];
  const next = ctx.i + 1 < ctx.code.length ? ctx.code[ctx.i + 1] : '';
  if (ch === '*' && next === '/') {
    ctx.state.inMultiLineComment = false;
    ctx.i += 2;
  } else {
    ctx.i++;
  }
}

function minifyStringChar(ctx: MinifyContext): void {
  const ch = ctx.code[ctx.i];
  if (ch === '\\') {
    const esc = handleEscape(ctx.code, ctx.i);
    ctx.result += esc.text;
    ctx.i += esc.consumed;
    return;
  }
  tryCloseString(ctx.state, ch);
  ctx.result += ch;
  ctx.i++;
}

function minifyWhitespace(ctx: MinifyContext): void {
  ctx.i = skipWhitespace(ctx.code, ctx.i, /\s/);
  if (ctx.result.length > 0 && ctx.i < ctx.code.length) {
    const lastChar = ctx.result[ctx.result.length - 1];
    const nextChar = ctx.code[ctx.i];
    if (/[a-zA-Z0-9_$]/.test(lastChar) && /[a-zA-Z0-9_$]/.test(nextChar)) {
      ctx.result += ' ';
    }
  }
}

/** Handle context-aware chars for minify. Returns true if handled. */
function handleMinifyContextChar(ctx: MinifyContext): boolean {
  if (ctx.state.inSingleLineComment) {
    minifySingleLineComment(ctx);
    return true;
  }
  if (ctx.state.inMultiLineComment) {
    minifyMultiLineComment(ctx);
    return true;
  }
  if (isInString(ctx.state)) {
    minifyStringChar(ctx);
    return true;
  }
  return false;
}

/**
 * Minify TypeScript/JavaScript code by removing unnecessary whitespace and comments.
 */
export function minifyTs(code: string): string {
  if (!code.trim()) return '';

  const ctx: MinifyContext = {
    code,
    state: createParserState(),
    result: '',
    i: 0,
  };

  while (ctx.i < code.length) {
    const ch = code[ctx.i];
    const next = ctx.i + 1 < code.length ? code[ctx.i + 1] : '';

    if (handleMinifyContextChar(ctx)) continue;

    const commentLen = tryStartComment(ctx.state, ch, next);
    if (commentLen > 0) {
      ctx.i += commentLen;
      continue;
    }
    if (tryOpenString(ctx.state, ch)) {
      ctx.result += ch;
      ctx.i++;
      continue;
    }
    if (/\s/.test(ch)) {
      minifyWhitespace(ctx);
      continue;
    }

    ctx.result += ch;
    ctx.i++;
  }

  return ctx.result.trim();
}
