type Token =
  | { type: 'number'; value: number }
  | { type: 'variable'; name: string }
  | { type: 'operator'; value: string }
  | { type: 'function'; name: string }
  | { type: 'paren'; value: '(' | ')' }
  | { type: 'comma' };

export type ASTNode =
  | { type: 'number'; value: number }
  | { type: 'variable'; name: string }
  | { type: 'binary'; op: string; left: ASTNode; right: ASTNode }
  | { type: 'unary'; op: string; operand: ASTNode }
  | { type: 'call'; name: string; args: ASTNode[] };

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = expr.replace(/\s+/g, '');

  while (i < s.length) {
    const ch = s[i];

    // Number
    if (/\d/.test(ch) || (ch === '.' && i + 1 < s.length && /\d/.test(s[i + 1]))) {
      let num = '';
      while (i < s.length && (/\d/.test(s[i]) || s[i] === '.')) {
        num += s[i];
        i++;
      }
      tokens.push({ type: 'number', value: parseFloat(num) });
      continue;
    }

    // Named constants and functions
    if (/[a-zA-Z]/.test(ch)) {
      let name = '';
      while (i < s.length && /[a-zA-Z0-9_]/.test(s[i])) {
        name += s[i];
        i++;
      }
      const lower = name.toLowerCase();
      if (lower === 'pi') {
        tokens.push({ type: 'number', value: Math.PI });
      } else if (lower === 'e' && (i >= s.length || s[i] !== '(')) {
        // 'e' as Euler's number if not followed by '('
        tokens.push({ type: 'number', value: Math.E });
      } else if (
        [
          'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
          'sqrt', 'abs', 'log', 'ln', 'exp', 'ceil', 'floor', 'round',
        ].includes(lower)
      ) {
        tokens.push({ type: 'function', name: lower });
      } else if (lower === 'x') {
        tokens.push({ type: 'variable', name: 'x' });
      } else {
        tokens.push({ type: 'variable', name: lower });
      }
      continue;
    }

    if ('+-*/^%'.includes(ch)) {
      tokens.push({ type: 'operator', value: ch });
      i++;
      continue;
    }

    if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', value: ch });
      i++;
      continue;
    }

    if (ch === ',') {
      tokens.push({ type: 'comma' });
      i++;
      continue;
    }

    i++; // skip unknown
  }

  // Insert implicit multiplication: 2x -> 2*x, x(... -> x*(, )(... -> )*(, 2(... -> 2*(
  const result: Token[] = [];
  for (let j = 0; j < tokens.length; j++) {
    result.push(tokens[j]);
    if (j < tokens.length - 1) {
      const curr = tokens[j];
      const next = tokens[j + 1];
      const needsMul =
        (curr.type === 'number' && (next.type === 'variable' || next.type === 'function' || (next.type === 'paren' && next.value === '('))) ||
        (curr.type === 'variable' && (next.type === 'number' || next.type === 'variable' || next.type === 'function' || (next.type === 'paren' && next.value === '('))) ||
        (curr.type === 'paren' && curr.value === ')' && (next.type === 'number' || next.type === 'variable' || next.type === 'function' || (next.type === 'paren' && next.value === '(')));
      if (needsMul) {
        result.push({ type: 'operator', value: '*' });
      }
    }
  }

  return result;
}

class Parser {
  private tokens: Token[];
  private pos: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    return this.tokens[this.pos++];
  }

  parse(): ASTNode {
    const node = this.parseExpression();
    if (this.pos < this.tokens.length) {
      throw new Error('Unexpected token after expression');
    }
    return node;
  }

  private parseExpression(): ASTNode {
    return this.parseAddSub();
  }

  private parseAddSub(): ASTNode {
    let left = this.parseMulDiv();
    while (this.peek()?.type === 'operator' && (this.peek()!.value === '+' || this.peek()!.value === '-')) {
      const op = this.consume().value as string;
      const right = this.parseMulDiv();
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  private parseMulDiv(): ASTNode {
    let left = this.parsePower();
    while (this.peek()?.type === 'operator' && (this.peek()!.value === '*' || this.peek()!.value === '/' || this.peek()!.value === '%')) {
      const op = this.consume().value as string;
      const right = this.parsePower();
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  private parsePower(): ASTNode {
    const base = this.parseUnary();
    if (this.peek()?.type === 'operator' && this.peek()!.value === '^') {
      this.consume();
      const exp = this.parsePower(); // right-associative
      return { type: 'binary', op: '^', left: base, right: exp };
    }
    return base;
  }

  private parseUnary(): ASTNode {
    if (this.peek()?.type === 'operator' && (this.peek()!.value === '-' || this.peek()!.value === '+')) {
      const op = this.consume().value as string;
      const operand = this.parseUnary();
      if (op === '+') return operand;
      return { type: 'unary', op: '-', operand };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): ASTNode {
    const token = this.peek();
    if (!token) throw new Error('Unexpected end of expression');

    if (token.type === 'number') {
      this.consume();
      return { type: 'number', value: token.value };
    }

    if (token.type === 'variable') {
      this.consume();
      return { type: 'variable', name: token.name };
    }

    if (token.type === 'function') {
      this.consume();
      if (this.peek()?.type !== 'paren' || this.peek()?.value !== '(') {
        throw new Error(`Expected '(' after function ${token.name}`);
      }
      this.consume(); // (
      const args: ASTNode[] = [];
      if (this.peek()?.type !== 'paren' || this.peek()?.value !== ')') {
        args.push(this.parseExpression());
        while (this.peek()?.type === 'comma') {
          this.consume();
          args.push(this.parseExpression());
        }
      }
      if (this.peek()?.type !== 'paren' || this.peek()?.value !== ')') {
        throw new Error(`Expected ')' after function arguments`);
      }
      this.consume(); // )
      return { type: 'call', name: token.name, args };
    }

    if (token.type === 'paren' && token.value === '(') {
      this.consume();
      const expr = this.parseExpression();
      if (this.peek()?.type !== 'paren' || this.peek()?.value !== ')') {
        throw new Error('Expected closing parenthesis');
      }
      this.consume();
      return expr;
    }

    throw new Error(`Unexpected token: ${JSON.stringify(token)}`);
  }
}

export function parse(expr: string): ASTNode {
  const tokens = tokenize(expr);
  if (tokens.length === 0) throw new Error('Empty expression');
  return new Parser(tokens).parse();
}

export function evaluate(node: ASTNode, vars: Record<string, number> = {}): number {
  switch (node.type) {
    case 'number':
      return node.value;

    case 'variable':
      if (node.name in vars) return vars[node.name];
      throw new Error(`Unknown variable: ${node.name}`);

    case 'binary': {
      const left = evaluate(node.left, vars);
      const right = evaluate(node.right, vars);
      switch (node.op) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return right === 0 ? NaN : left / right;
        case '%': return left % right;
        case '^': return Math.pow(left, right);
        default: throw new Error(`Unknown operator: ${node.op}`);
      }
    }

    case 'unary':
      if (node.op === '-') return -evaluate(node.operand, vars);
      throw new Error(`Unknown unary operator: ${node.op}`);

    case 'call': {
      const args = node.args.map((a) => evaluate(a, vars));
      switch (node.name) {
        case 'sin': return Math.sin(args[0]);
        case 'cos': return Math.cos(args[0]);
        case 'tan': return Math.tan(args[0]);
        case 'asin': return Math.asin(args[0]);
        case 'acos': return Math.acos(args[0]);
        case 'atan': return Math.atan(args[0]);
        case 'sqrt': return Math.sqrt(args[0]);
        case 'abs': return Math.abs(args[0]);
        case 'log': return Math.log10(args[0]);
        case 'ln': return Math.log(args[0]);
        case 'exp': return Math.exp(args[0]);
        case 'ceil': return Math.ceil(args[0]);
        case 'floor': return Math.floor(args[0]);
        case 'round': return Math.round(args[0]);
        default: throw new Error(`Unknown function: ${node.name}`);
      }
    }
  }
}

export function safeEvaluate(expr: string, x: number): number | null {
  try {
    const ast = parse(expr);
    const result = evaluate(ast, { x });
    if (!isFinite(result)) return null;
    return result;
  } catch {
    return null;
  }
}
