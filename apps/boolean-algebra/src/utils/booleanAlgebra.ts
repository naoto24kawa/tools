type BoolToken =
  | { type: 'var'; name: string }
  | { type: 'const'; value: boolean }
  | { type: 'op'; value: string }
  | { type: 'paren'; value: '(' | ')' };

type BoolAST =
  | { type: 'var'; name: string }
  | { type: 'const'; value: boolean }
  | { type: 'not'; operand: BoolAST }
  | { type: 'binary'; op: 'and' | 'or' | 'xor'; left: BoolAST; right: BoolAST };

function tokenize(expr: string): BoolToken[] {
  const tokens: BoolToken[] = [];
  let i = 0;
  const s = expr.replace(/\s+/g, ' ');

  while (i < s.length) {
    const ch = s[i];

    if (ch === ' ') {
      i++;
      continue;
    }

    if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', value: ch });
      i++;
      continue;
    }

    if (ch === '!' || ch === '~') {
      tokens.push({ type: 'op', value: 'NOT' });
      i++;
      continue;
    }

    if (ch === '&') {
      if (s[i + 1] === '&') i++;
      tokens.push({ type: 'op', value: 'AND' });
      i++;
      continue;
    }

    if (ch === '|') {
      if (s[i + 1] === '|') i++;
      tokens.push({ type: 'op', value: 'OR' });
      i++;
      continue;
    }

    if (ch === '^') {
      tokens.push({ type: 'op', value: 'XOR' });
      i++;
      continue;
    }

    if (/[a-zA-Z]/.test(ch)) {
      let word = '';
      while (i < s.length && /[a-zA-Z0-9]/.test(s[i])) {
        word += s[i];
        i++;
      }
      const upper = word.toUpperCase();
      if (upper === 'AND') {
        tokens.push({ type: 'op', value: 'AND' });
      } else if (upper === 'OR') {
        tokens.push({ type: 'op', value: 'OR' });
      } else if (upper === 'NOT') {
        tokens.push({ type: 'op', value: 'NOT' });
      } else if (upper === 'XOR') {
        tokens.push({ type: 'op', value: 'XOR' });
      } else if (upper === 'TRUE' || upper === '1') {
        tokens.push({ type: 'const', value: true });
      } else if (upper === 'FALSE' || upper === '0') {
        tokens.push({ type: 'const', value: false });
      } else {
        tokens.push({ type: 'var', name: upper });
      }
      continue;
    }

    if (ch === '0') {
      tokens.push({ type: 'const', value: false });
      i++;
      continue;
    }
    if (ch === '1') {
      tokens.push({ type: 'const', value: true });
      i++;
      continue;
    }

    i++; // skip unknown
  }

  return tokens;
}

class BoolParser {
  private tokens: BoolToken[];
  private pos: number;

  constructor(tokens: BoolToken[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

  private peek(): BoolToken | undefined {
    return this.tokens[this.pos];
  }

  private consume(): BoolToken {
    return this.tokens[this.pos++];
  }

  parse(): BoolAST {
    const node = this.parseOr();
    if (this.pos < this.tokens.length) {
      throw new Error('Unexpected token after expression');
    }
    return node;
  }

  private parseOr(): BoolAST {
    let left = this.parseXor();
    while (this.peek()?.type === 'op' && (this.peek() as { value: string }).value === 'OR') {
      this.consume();
      const right = this.parseXor();
      left = { type: 'binary', op: 'or', left, right };
    }
    return left;
  }

  private parseXor(): BoolAST {
    let left = this.parseAnd();
    while (this.peek()?.type === 'op' && (this.peek() as { value: string }).value === 'XOR') {
      this.consume();
      const right = this.parseAnd();
      left = { type: 'binary', op: 'xor', left, right };
    }
    return left;
  }

  private parseAnd(): BoolAST {
    let left = this.parseNot();
    while (this.peek()?.type === 'op' && (this.peek() as { value: string }).value === 'AND') {
      this.consume();
      const right = this.parseNot();
      left = { type: 'binary', op: 'and', left, right };
    }
    return left;
  }

  private parseNot(): BoolAST {
    if (this.peek()?.type === 'op' && (this.peek() as { value: string }).value === 'NOT') {
      this.consume();
      const operand = this.parseNot();
      return { type: 'not', operand };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): BoolAST {
    const token = this.peek();
    if (!token) throw new Error('Unexpected end of expression');

    if (token.type === 'var') {
      this.consume();
      return { type: 'var', name: token.name };
    }

    if (token.type === 'const') {
      this.consume();
      return { type: 'const', value: token.value };
    }

    if (token.type === 'paren' && token.value === '(') {
      this.consume();
      const expr = this.parseOr();
      if (this.peek()?.type !== 'paren' || (this.peek() as { value: string }).value !== ')') {
        throw new Error('Expected closing parenthesis');
      }
      this.consume();
      return expr;
    }

    throw new Error(`Unexpected token: ${JSON.stringify(token)}`);
  }
}

function parseBool(expr: string): BoolAST {
  const tokens = tokenize(expr);
  if (tokens.length === 0) throw new Error('Empty expression');
  return new BoolParser(tokens).parse();
}

export function extractVariables(expr: string): string[] {
  const tokens = tokenize(expr);
  const vars = new Set<string>();
  for (const t of tokens) {
    if (t.type === 'var') {
      vars.add(t.name);
    }
  }
  return Array.from(vars).sort();
}

export function evaluate(
  expr: string,
  vars: Record<string, boolean>
): boolean {
  const ast = parseBool(expr);
  return evalAST(ast, vars);
}

function evalAST(node: BoolAST, vars: Record<string, boolean>): boolean {
  switch (node.type) {
    case 'var':
      if (!(node.name in vars)) {
        throw new Error(`Unknown variable: ${node.name}`);
      }
      return vars[node.name];
    case 'const':
      return node.value;
    case 'not':
      return !evalAST(node.operand, vars);
    case 'binary': {
      const left = evalAST(node.left, vars);
      const right = evalAST(node.right, vars);
      switch (node.op) {
        case 'and':
          return left && right;
        case 'or':
          return left || right;
        case 'xor':
          return left !== right;
      }
    }
  }
}

export interface TruthTableRow {
  inputs: Record<string, boolean>;
  output: boolean;
}

export function truthTable(expr: string): TruthTableRow[] {
  const variables = extractVariables(expr);
  const rows: TruthTableRow[] = [];
  const n = variables.length;
  const totalRows = Math.pow(2, n);

  for (let i = 0; i < totalRows; i++) {
    const inputs: Record<string, boolean> = {};
    for (let j = 0; j < n; j++) {
      inputs[variables[j]] = Boolean((i >> (n - 1 - j)) & 1);
    }
    const output = evaluate(expr, inputs);
    rows.push({ inputs, output });
  }

  return rows;
}

export function simplify(expr: string): string {
  // Basic simplification via truth table analysis
  const variables = extractVariables(expr);
  const table = truthTable(expr);

  // If all outputs are the same
  if (table.every((r) => r.output)) return '1 (TRUE)';
  if (table.every((r) => !r.output)) return '0 (FALSE)';

  // If only one variable, detect common patterns
  if (variables.length === 1) {
    const v = variables[0];
    const [row0, row1] = table;
    if (!row0.output && row1.output) return v;
    if (row0.output && !row1.output) return `NOT ${v}`;
  }

  // Find minterms (rows where output is true)
  const minterms = table
    .filter((r) => r.output)
    .map((r) => {
      const terms = variables.map((v) => (r.inputs[v] ? v : `!${v}`));
      return terms.join(' & ');
    });

  if (minterms.length <= table.length / 2) {
    return minterms.join(' | ');
  }

  // Find maxterms (rows where output is false)
  const maxterms = table
    .filter((r) => !r.output)
    .map((r) => {
      const terms = variables.map((v) => (r.inputs[v] ? `!${v}` : v));
      return `(${terms.join(' | ')})`;
    });

  return maxterms.join(' & ');
}

export function astToString(expr: string): string {
  try {
    const ast = parseBool(expr);
    return nodeToString(ast);
  } catch {
    return expr;
  }
}

function nodeToString(node: BoolAST): string {
  switch (node.type) {
    case 'var':
      return node.name;
    case 'const':
      return node.value ? '1' : '0';
    case 'not':
      return `NOT(${nodeToString(node.operand)})`;
    case 'binary':
      return `(${nodeToString(node.left)} ${node.op.toUpperCase()} ${nodeToString(node.right)})`;
  }
}
