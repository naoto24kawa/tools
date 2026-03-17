const KEYWORDS = new Set([
  'SELECT',
  'FROM',
  'WHERE',
  'AND',
  'OR',
  'JOIN',
  'LEFT',
  'RIGHT',
  'INNER',
  'OUTER',
  'FULL',
  'CROSS',
  'ON',
  'ORDER',
  'BY',
  'GROUP',
  'HAVING',
  'LIMIT',
  'OFFSET',
  'INSERT',
  'INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE',
  'CREATE',
  'TABLE',
  'ALTER',
  'DROP',
  'INDEX',
  'UNION',
  'ALL',
  'AS',
  'DISTINCT',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'IN',
  'NOT',
  'NULL',
  'IS',
  'LIKE',
  'BETWEEN',
  'EXISTS',
  'COUNT',
  'SUM',
  'AVG',
  'MIN',
  'MAX',
  'CAST',
]);

const NEWLINE_BEFORE = new Set([
  'SELECT',
  'FROM',
  'WHERE',
  'AND',
  'OR',
  'JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'INNER JOIN',
  'OUTER JOIN',
  'FULL JOIN',
  'CROSS JOIN',
  'ORDER BY',
  'GROUP BY',
  'HAVING',
  'LIMIT',
  'OFFSET',
  'UNION',
  'UNION ALL',
  'INSERT INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE FROM',
  'ON',
]);

const DELIMITERS = new Set(['(', ')', ',', ';']);

interface FormatState {
  lines: string[];
  currentLine: string;
  level: number;
  indent: string;
}

function pushLine(state: FormatState, depth: number): void {
  if (state.currentLine.trim()) {
    state.lines.push(state.indent.repeat(depth) + state.currentLine.trim());
  }
}

function handleOpenParen(state: FormatState): void {
  state.currentLine += ' (';
  state.level++;
  pushLine(state, Math.max(0, state.level - 1));
  state.currentLine = '';
}

function handleCloseParen(state: FormatState): void {
  pushLine(state, state.level);
  state.currentLine = '';
  state.level = Math.max(0, state.level - 1);
  state.lines.push(`${state.indent.repeat(state.level)})`);
}

function handleCombinedKeyword(state: FormatState, token: string, nextToken: string): void {
  pushLine(state, state.level);
  state.currentLine = `${token} ${nextToken}`;
}

function handleSingleKeyword(state: FormatState, token: string): void {
  pushLine(state, state.level);
  state.currentLine = token;
}

export function formatSql(sql: string, indentSize: number = 2): string {
  const tokens = tokenizeSql(sql);
  const state: FormatState = {
    lines: [],
    currentLine: '',
    level: 0,
    indent: ' '.repeat(indentSize),
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const upper = token.toUpperCase();

    if (upper === '(') {
      handleOpenParen(state);
      continue;
    }
    if (upper === ')') {
      handleCloseParen(state);
      continue;
    }

    const combined = i + 1 < tokens.length ? `${upper} ${tokens[i + 1].toUpperCase()}` : '';
    if (NEWLINE_BEFORE.has(combined)) {
      handleCombinedKeyword(state, token, tokens[i + 1]);
      i++;
      continue;
    }

    if (NEWLINE_BEFORE.has(upper)) {
      handleSingleKeyword(state, token);
      continue;
    }

    state.currentLine += (state.currentLine ? ' ' : '') + token;
  }

  pushLine(state, state.level);
  return state.lines.join('\n');
}

function flushToken(tokens: string[], current: string): string {
  if (current.trim()) {
    tokens.push(current.trim());
  }
  return '';
}

function handleStringChar(
  char: string,
  current: string
): { current: string; inString: boolean; stringChar: string } {
  return { current: current + char, inString: true, stringChar: char };
}

function tokenizeSql(sql: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inString = false;
  let stringChar = '';

  for (const char of sql) {
    if (inString) {
      current += char;
      if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (char === "'" || char === '"') {
      const result = handleStringChar(char, current);
      current = result.current;
      inString = result.inString;
      stringChar = result.stringChar;
      continue;
    }

    if (DELIMITERS.has(char)) {
      current = flushToken(tokens, current);
      tokens.push(char);
      continue;
    }

    if (/\s/.test(char)) {
      current = flushToken(tokens, current);
      continue;
    }

    current += char;
  }
  flushToken(tokens, current);

  return uppercaseKeywords(tokens);
}

function uppercaseKeywords(tokens: string[]): string[] {
  return tokens.map((t) => {
    const upper = t.toUpperCase();
    return KEYWORDS.has(upper) ? upper : t;
  });
}

export function minifySql(sql: string): string {
  return sql.replace(/--.*$/gm, '').replace(/\s+/g, ' ').trim();
}
