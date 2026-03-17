export type CharType = 'hiragana' | 'katakana' | 'kanji' | 'latin' | 'number' | 'symbol' | 'space';

export interface Token {
  surface: string;
  type: CharType;
}

function getCharType(char: string): CharType {
  const code = char.charCodeAt(0);
  if (/\s/.test(char)) return 'space';
  if (code >= 0x3040 && code <= 0x309f) return 'hiragana';
  if (code >= 0x30a0 && code <= 0x30ff) return 'katakana';
  if ((code >= 0x4e00 && code <= 0x9fff) || (code >= 0x3400 && code <= 0x4dbf)) return 'kanji';
  if (/[a-zA-Z]/.test(char)) return 'latin';
  if (/[0-9]/.test(char)) return 'number';
  return 'symbol';
}

export function tokenize(text: string): Token[] {
  if (!text) return [];

  const tokens: Token[] = [];
  let currentSurface = '';
  let currentType: CharType | null = null;

  for (const char of text) {
    const charType = getCharType(char);

    if (currentType === null) {
      currentType = charType;
      currentSurface = char;
    } else if (charType === currentType) {
      currentSurface += char;
    } else {
      tokens.push({ surface: currentSurface, type: currentType });
      currentType = charType;
      currentSurface = char;
    }
  }

  if (currentSurface) {
    tokens.push({ surface: currentSurface, type: currentType! });
  }

  return tokens;
}

export function getStats(tokens: Token[]): Record<CharType, number> {
  const stats: Record<string, number> = {};
  for (const token of tokens) {
    stats[token.type] = (stats[token.type] || 0) + 1;
  }
  return stats as Record<CharType, number>;
}

export const TYPE_LABELS: Record<CharType, string> = {
  hiragana: 'ひらがな',
  katakana: 'カタカナ',
  kanji: '漢字',
  latin: '英字',
  number: '数字',
  symbol: '記号',
  space: '空白',
};

export const TYPE_COLORS: Record<CharType, string> = {
  hiragana: '#3b82f6',
  katakana: '#10b981',
  kanji: '#ef4444',
  latin: '#8b5cf6',
  number: '#f59e0b',
  symbol: '#6b7280',
  space: '#d1d5db',
};
