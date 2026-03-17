export type Language = 'javascript' | 'python' | 'html' | 'css' | 'sql';

export const LANGUAGES: Language[] = ['javascript', 'python', 'html', 'css', 'sql'];

export const LANGUAGE_LABELS: Record<Language, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  html: 'HTML',
  css: 'CSS',
  sql: 'SQL',
};

export interface Token {
  text: string;
  className: string | null;
}

interface TokenRule {
  pattern: RegExp;
  className: string;
}

const JS_RULES: TokenRule[] = [
  {
    pattern: /\/\*[\s\S]*?\*\//g,
    className: 'comment',
  },
  {
    pattern: /\/\/.*$/gm,
    className: 'comment',
  },
  {
    pattern: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
    className: 'string',
  },
  {
    pattern:
      /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|throw|new|this|typeof|instanceof)\b/g,
    className: 'keyword',
  },
  {
    pattern: /\b\d+\.?\d*\b/g,
    className: 'number',
  },
];

const PYTHON_RULES: TokenRule[] = [
  {
    pattern: /("""[\s\S]*?"""|'''[\s\S]*?''')/g,
    className: 'string',
  },
  {
    pattern: /#.*$/gm,
    className: 'comment',
  },
  {
    pattern: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
    className: 'string',
  },
  {
    pattern:
      /\b(def|class|import|from|return|if|elif|else|for|while|try|except|finally|with|as|in|not|and|or|True|False|None|self|lambda|yield|raise|pass|break|continue)\b/g,
    className: 'keyword',
  },
  {
    pattern: /\b\d+\.?\d*\b/g,
    className: 'number',
  },
];

const HTML_RULES: TokenRule[] = [
  {
    pattern: /<!--[\s\S]*?-->/g,
    className: 'comment',
  },
  {
    pattern: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
    className: 'string',
  },
  {
    pattern: /<\/?[a-zA-Z][a-zA-Z0-9]*\b[^>]*\/?>/g,
    className: 'keyword',
  },
];

const CSS_RULES: TokenRule[] = [
  {
    pattern: /\/\*[\s\S]*?\*\//g,
    className: 'comment',
  },
  {
    pattern: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
    className: 'string',
  },
  {
    pattern:
      /\b(color|background|margin|padding|border|font|display|position|width|height|top|left|right|bottom|flex|grid|align|justify|text|overflow|opacity|z-index|transition|transform|animation)\b/g,
    className: 'keyword',
  },
  {
    pattern: /#[0-9a-fA-F]{3,8}\b/g,
    className: 'number',
  },
  {
    pattern: /\b\d+\.?\d*(px|em|rem|%|vh|vw|s|ms)?\b/g,
    className: 'number',
  },
];

const SQL_RULES: TokenRule[] = [
  {
    pattern: /--.*$/gm,
    className: 'comment',
  },
  {
    pattern: /\/\*[\s\S]*?\*\//g,
    className: 'comment',
  },
  {
    pattern: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
    className: 'string',
  },
  {
    pattern:
      /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INTO|VALUES|SET|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AND|OR|NOT|NULL|IS|IN|LIKE|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN|UNION|ALL|EXISTS|BETWEEN|CASE|WHEN|THEN|ELSE|END|PRIMARY|KEY|FOREIGN|INDEX|CONSTRAINT|DEFAULT|CASCADE|CHECK|UNIQUE|VIEW|TRIGGER|PROCEDURE|FUNCTION|BEGIN|COMMIT|ROLLBACK|GRANT|REVOKE)\b/gi,
    className: 'keyword',
  },
  {
    pattern: /\b\d+\.?\d*\b/g,
    className: 'number',
  },
];

const RULES_MAP: Record<Language, TokenRule[]> = {
  javascript: JS_RULES,
  python: PYTHON_RULES,
  html: HTML_RULES,
  css: CSS_RULES,
  sql: SQL_RULES,
};

interface Match {
  start: number;
  end: number;
  text: string;
  className: string;
}

/**
 * Tokenize source code into an array of Token objects.
 * Each token has text and an optional className for highlighting.
 * This approach avoids dangerouslySetInnerHTML - tokens are rendered as React elements.
 */
export function tokenize(code: string, language: Language): Token[] {
  if (!code) {
    return [];
  }

  const rules = RULES_MAP[language];
  if (!rules) {
    return [{ text: code, className: null }];
  }

  // Collect all matches with their positions
  const matches: Match[] = [];

  for (const rule of rules) {
    // Create a new RegExp to reset lastIndex
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
    let match: RegExpExecArray | null = regex.exec(code);
    while (match !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        className: rule.className,
      });
      match = regex.exec(code);
    }
  }

  // Sort by start position; for overlaps, earlier rules take priority (longer match first)
  matches.sort((a, b) => a.start - b.start || b.end - a.end);

  // Remove overlapping matches (first match wins)
  const filtered: Match[] = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      filtered.push(m);
      lastEnd = m.end;
    }
  }

  // Build token array
  const tokens: Token[] = [];
  let pos = 0;

  for (const m of filtered) {
    if (m.start > pos) {
      tokens.push({ text: code.slice(pos, m.start), className: null });
    }
    tokens.push({ text: m.text, className: m.className });
    pos = m.end;
  }

  if (pos < code.length) {
    tokens.push({ text: code.slice(pos), className: null });
  }

  return tokens;
}

/**
 * Generate highlighted HTML string (for clipboard copy of highlighted code).
 */
export function highlightToHtml(code: string, language: Language): string {
  const tokens = tokenize(code, language);
  return tokens
    .map((token) => {
      const escaped = escapeHtml(token.text);
      if (token.className) {
        return `<span class="sh-${token.className}">${escaped}</span>`;
      }
      return escaped;
    })
    .join('');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
