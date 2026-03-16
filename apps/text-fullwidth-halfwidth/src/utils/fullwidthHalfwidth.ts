const CONVERT_MODE_OPTIONS = [
  { value: 'toHalfwidth', label: '半角に変換', description: '全角文字を半角に変換' },
  { value: 'toFullwidth', label: '全角に変換', description: '半角文字を全角に変換' },
] as const;

export { CONVERT_MODE_OPTIONS };

export type ConvertMode = (typeof CONVERT_MODE_OPTIONS)[number]['value'];

export interface ConvertOptions {
  mode: ConvertMode;
  alphanumeric: boolean;
  katakana: boolean;
  symbol: boolean;
}

export const DEFAULT_OPTIONS: ConvertOptions = {
  mode: 'toHalfwidth',
  alphanumeric: true,
  katakana: true,
  symbol: true,
};

function toHalfwidthAlphanumeric(text: string): string {
  return text.replace(/[\uFF01-\uFF5E]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0xfee0)
  );
}

function toFullwidthAlphanumeric(text: string): string {
  return text.replace(/[!-~]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 0xfee0));
}

const KATAKANA_MAP: Record<string, string> = {
  '\u30AC': '\uFF76\uFF9E',
  '\u30AE': '\uFF77\uFF9E',
  '\u30B0': '\uFF78\uFF9E',
  '\u30B2': '\uFF79\uFF9E',
  '\u30B4': '\uFF7A\uFF9E',
  '\u30B6': '\uFF7B\uFF9E',
  '\u30B8': '\uFF7C\uFF9E',
  '\u30BA': '\uFF7D\uFF9E',
  '\u30BC': '\uFF7E\uFF9E',
  '\u30BE': '\uFF7F\uFF9E',
  '\u30C0': '\uFF80\uFF9E',
  '\u30C2': '\uFF81\uFF9E',
  '\u30C5': '\uFF82\uFF9E',
  '\u30C7': '\uFF83\uFF9E',
  '\u30C9': '\uFF84\uFF9E',
  '\u30D0': '\uFF8A\uFF9E',
  '\u30D3': '\uFF8B\uFF9E',
  '\u30D6': '\uFF8C\uFF9E',
  '\u30D9': '\uFF8D\uFF9E',
  '\u30DC': '\uFF8E\uFF9E',
  '\u30D1': '\uFF8A\uFF9F',
  '\u30D4': '\uFF8B\uFF9F',
  '\u30D7': '\uFF8C\uFF9F',
  '\u30DA': '\uFF8D\uFF9F',
  '\u30DD': '\uFF8E\uFF9F',
  '\u30F4': '\uFF73\uFF9E',
  '\u30A2': '\uFF71',
  '\u30A4': '\uFF72',
  '\u30A6': '\uFF73',
  '\u30A8': '\uFF74',
  '\u30AA': '\uFF75',
  '\u30AB': '\uFF76',
  '\u30AD': '\uFF77',
  '\u30AF': '\uFF78',
  '\u30B1': '\uFF79',
  '\u30B3': '\uFF7A',
  '\u30B5': '\uFF7B',
  '\u30B7': '\uFF7C',
  '\u30B9': '\uFF7D',
  '\u30BB': '\uFF7E',
  '\u30BD': '\uFF7F',
  '\u30BF': '\uFF80',
  '\u30C1': '\uFF81',
  '\u30C4': '\uFF82',
  '\u30C6': '\uFF83',
  '\u30C8': '\uFF84',
  '\u30CA': '\uFF85',
  '\u30CB': '\uFF86',
  '\u30CC': '\uFF87',
  '\u30CD': '\uFF88',
  '\u30CE': '\uFF89',
  '\u30CF': '\uFF8A',
  '\u30D2': '\uFF8B',
  '\u30D5': '\uFF8C',
  '\u30D8': '\uFF8D',
  '\u30DB': '\uFF8E',
  '\u30DE': '\uFF8F',
  '\u30DF': '\uFF90',
  '\u30E0': '\uFF91',
  '\u30E1': '\uFF92',
  '\u30E2': '\uFF93',
  '\u30E4': '\uFF94',
  '\u30E6': '\uFF95',
  '\u30E8': '\uFF96',
  '\u30E9': '\uFF97',
  '\u30EA': '\uFF98',
  '\u30EB': '\uFF99',
  '\u30EC': '\uFF9A',
  '\u30ED': '\uFF9B',
  '\u30EF': '\uFF9C',
  '\u30F2': '\uFF66',
  '\u30F3': '\uFF9D',
  '\u30A1': '\uFF67',
  '\u30A3': '\uFF68',
  '\u30A5': '\uFF69',
  '\u30A7': '\uFF6A',
  '\u30A9': '\uFF6B',
  '\u30C3': '\uFF6F',
  '\u30E3': '\uFF6C',
  '\u30E5': '\uFF6D',
  '\u30E7': '\uFF6E',
  '\u30FC': '\uFF70',
  '\u3002': '\uFF61',
  '\u3001': '\uFF64',
  '\u300C': '\uFF62',
  '\u300D': '\uFF63',
  '\u30FB': '\uFF65',
};

const HALF_TO_FULL_KATAKANA_MAP: Record<string, string> = {};
for (const [full, half] of Object.entries(KATAKANA_MAP)) {
  HALF_TO_FULL_KATAKANA_MAP[half] = full;
}

function toHalfwidthKatakana(text: string): string {
  let result = '';
  for (const char of text) {
    result += KATAKANA_MAP[char] ?? char;
  }
  return result;
}

function toFullwidthKatakana(text: string): string {
  let result = '';
  let i = 0;
  while (i < text.length) {
    const twoChar = text.slice(i, i + 2);
    if (twoChar.length === 2 && HALF_TO_FULL_KATAKANA_MAP[twoChar]) {
      result += HALF_TO_FULL_KATAKANA_MAP[twoChar];
      i += 2;
    } else {
      const oneChar = text[i];
      result += HALF_TO_FULL_KATAKANA_MAP[oneChar] ?? oneChar;
      i += 1;
    }
  }
  return result;
}

const SYMBOL_TO_HALF: Record<string, string> = {
  '\u3000': ' ',
  '\u2018': "'",
  '\u2019': "'",
  '\u201C': '"',
  '\u201D': '"',
};

const SYMBOL_TO_FULL: Record<string, string> = {};
for (const [full, half] of Object.entries(SYMBOL_TO_HALF)) {
  SYMBOL_TO_FULL[half] = full;
}

function toHalfwidthSymbol(text: string): string {
  let result = '';
  for (const char of text) {
    result += SYMBOL_TO_HALF[char] ?? char;
  }
  return result;
}

function toFullwidthSymbol(text: string): string {
  let result = '';
  for (const char of text) {
    result += SYMBOL_TO_FULL[char] ?? char;
  }
  return result;
}

export function convert(input: string, options: ConvertOptions): string {
  let result = input;
  const { mode, alphanumeric, katakana, symbol } = options;

  if (mode === 'toHalfwidth') {
    if (alphanumeric) result = toHalfwidthAlphanumeric(result);
    if (katakana) result = toHalfwidthKatakana(result);
    if (symbol) result = toHalfwidthSymbol(result);
  } else {
    if (alphanumeric) result = toFullwidthAlphanumeric(result);
    if (katakana) result = toFullwidthKatakana(result);
    if (symbol) result = toFullwidthSymbol(result);
  }

  return result;
}
