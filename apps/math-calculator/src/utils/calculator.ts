// Simple expression parser - no eval/Function used for safety

type Token =
  | { type: 'number'; value: number }
  | { type: 'op'; value: string }
  | { type: 'paren'; value: string };

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    if (expr[i] === ' ') {
      i++;
      continue;
    }
    if ('0123456789.'.includes(expr[i])) {
      let num = '';
      while (i < expr.length && '0123456789.'.includes(expr[i])) {
        num += expr[i];
        i++;
      }
      tokens.push({ type: 'number', value: Number.parseFloat(num) });
      continue;
    }
    if ('+-*/%^'.includes(expr[i])) {
      tokens.push({ type: 'op', value: expr[i] });
      i++;
      continue;
    }
    if ('()'.includes(expr[i])) {
      tokens.push({ type: 'paren', value: expr[i] });
      i++;
      continue;
    }
    throw new Error(`Unexpected character: ${expr[i]}`);
  }
  return tokens;
}

function parse(tokens: Token[]): number {
  let pos = 0;

  function parseExpr(): number {
    let left = parseTerm();
    while (
      pos < tokens.length &&
      tokens[pos].type === 'op' &&
      (tokens[pos].value === '+' || tokens[pos].value === '-')
    ) {
      const op = tokens[pos].value;
      pos++;
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm(): number {
    let left = parseFactor();
    while (
      pos < tokens.length &&
      tokens[pos].type === 'op' &&
      (tokens[pos].value === '*' || tokens[pos].value === '/' || tokens[pos].value === '%')
    ) {
      const op = tokens[pos].value;
      pos++;
      const right = parseFactor();
      if (op === '*') left *= right;
      else if (op === '/') left /= right;
      else left %= right;
    }
    return left;
  }

  function parseFactor(): number {
    let left = parseUnary();
    while (pos < tokens.length && tokens[pos].type === 'op' && tokens[pos].value === '^') {
      pos++;
      const right = parseUnary();
      left = left ** right;
    }
    return left;
  }

  function parseUnary(): number {
    if (pos < tokens.length && tokens[pos].type === 'op' && tokens[pos].value === '-') {
      pos++;
      return -parseUnary();
    }
    if (pos < tokens.length && tokens[pos].type === 'op' && tokens[pos].value === '+') {
      pos++;
      return parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary(): number {
    if (pos < tokens.length && tokens[pos].type === 'paren' && tokens[pos].value === '(') {
      pos++;
      const result = parseExpr();
      if (pos < tokens.length && tokens[pos].type === 'paren' && tokens[pos].value === ')') pos++;
      return result;
    }
    if (pos < tokens.length && tokens[pos].type === 'number') {
      return tokens[pos++].value;
    }
    throw new Error('Unexpected token');
  }

  const result = parseExpr();
  return result;
}

export function calculate(expression: string): { result: number; error: string | null } {
  if (!expression.trim()) return { result: 0, error: null };
  try {
    const tokens = tokenize(expression);
    if (tokens.length === 0) return { result: 0, error: null };
    const result = parse(tokens);
    if (!Number.isFinite(result)) return { result: 0, error: 'Invalid result' };
    return { result, error: null };
  } catch (e) {
    return { result: 0, error: e instanceof Error ? e.message : 'Invalid expression' };
  }
}
