export interface SlugifyOptions {
  separator: string;
  lowercase: boolean;
  removeSpecialChars: boolean;
  maxLength: number;
}

export const DEFAULT_OPTIONS: SlugifyOptions = {
  separator: '-',
  lowercase: true,
  removeSpecialChars: true,
  maxLength: 0,
};

const ROMANIZE_MAP: Record<string, string> = {
  '\u3042': 'a',
  '\u3044': 'i',
  '\u3046': 'u',
  '\u3048': 'e',
  '\u304A': 'o',
  '\u304B': 'ka',
  '\u304D': 'ki',
  '\u304F': 'ku',
  '\u3051': 'ke',
  '\u3053': 'ko',
  '\u3055': 'sa',
  '\u3057': 'shi',
  '\u3059': 'su',
  '\u305B': 'se',
  '\u305D': 'so',
  '\u305F': 'ta',
  '\u3061': 'chi',
  '\u3064': 'tsu',
  '\u3066': 'te',
  '\u3068': 'to',
  '\u306A': 'na',
  '\u306B': 'ni',
  '\u306C': 'nu',
  '\u306D': 'ne',
  '\u306E': 'no',
  '\u306F': 'ha',
  '\u3072': 'hi',
  '\u3075': 'fu',
  '\u3078': 'he',
  '\u307B': 'ho',
  '\u307E': 'ma',
  '\u307F': 'mi',
  '\u3080': 'mu',
  '\u3081': 'me',
  '\u3082': 'mo',
  '\u3084': 'ya',
  '\u3086': 'yu',
  '\u3088': 'yo',
  '\u3089': 'ra',
  '\u308A': 'ri',
  '\u308B': 'ru',
  '\u308C': 're',
  '\u308D': 'ro',
  '\u308F': 'wa',
  '\u3092': 'wo',
  '\u3093': 'n',
  '\u304C': 'ga',
  '\u304E': 'gi',
  '\u3050': 'gu',
  '\u3052': 'ge',
  '\u3054': 'go',
  '\u3056': 'za',
  '\u3058': 'ji',
  '\u305A': 'zu',
  '\u305C': 'ze',
  '\u305E': 'zo',
  '\u3060': 'da',
  '\u3062': 'di',
  '\u3065': 'du',
  '\u3067': 'de',
  '\u3069': 'do',
  '\u3070': 'ba',
  '\u3073': 'bi',
  '\u3076': 'bu',
  '\u3079': 'be',
  '\u307C': 'bo',
  '\u3071': 'pa',
  '\u3074': 'pi',
  '\u3077': 'pu',
  '\u307A': 'pe',
  '\u307D': 'po',
};

function romanize(text: string): string {
  let result = '';
  const katakanaToHiragana = text.replace(/[\u30A1-\u30F6]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x60)
  );
  for (const char of katakanaToHiragana) {
    result += ROMANIZE_MAP[char] ?? char;
  }
  return result;
}

export function slugify(text: string, options: SlugifyOptions): string {
  const { separator, lowercase, removeSpecialChars, maxLength } = options;

  let result = romanize(text);

  if (lowercase) {
    result = result.toLowerCase();
  }

  if (removeSpecialChars) {
    result = result.replace(/[^\w\s-]/g, '');
  }

  result = result.replace(/\s+/g, separator);
  result = result.replace(
    new RegExp(`${separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}+`, 'g'),
    separator
  );
  result = result.replace(
    new RegExp(
      `^${separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
      'g'
    ),
    ''
  );

  if (maxLength > 0 && result.length > maxLength) {
    result = result
      .slice(0, maxLength)
      .replace(new RegExp(`${separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), '');
  }

  return result;
}
