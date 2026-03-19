export interface HomoglyphResult {
  index: number;
  char: string;
  codePoint: string;
  script: string;
  confusableWith: string;
  confusableScript: string;
  risk: 'high' | 'medium' | 'low';
}

// Map of confusable characters: key is the suspicious char, value is [latin equivalent, script name]
const CONFUSABLES: Map<string, [string, string]> = new Map([
  // Cyrillic -> Latin
  ['\u0410', ['A', 'Cyrillic']],  // А
  ['\u0412', ['B', 'Cyrillic']],  // В
  ['\u0421', ['C', 'Cyrillic']],  // С
  ['\u0415', ['E', 'Cyrillic']],  // Е
  ['\u041D', ['H', 'Cyrillic']],  // Н
  ['\u041A', ['K', 'Cyrillic']],  // К
  ['\u041C', ['M', 'Cyrillic']],  // М
  ['\u041E', ['O', 'Cyrillic']],  // О
  ['\u0420', ['P', 'Cyrillic']],  // Р
  ['\u0422', ['T', 'Cyrillic']],  // Т
  ['\u0425', ['X', 'Cyrillic']],  // Х
  ['\u0430', ['a', 'Cyrillic']],  // а
  ['\u0441', ['c', 'Cyrillic']],  // с
  ['\u0435', ['e', 'Cyrillic']],  // е
  ['\u043E', ['o', 'Cyrillic']],  // о
  ['\u0440', ['p', 'Cyrillic']],  // р
  ['\u0445', ['x', 'Cyrillic']],  // х
  ['\u0443', ['y', 'Cyrillic']],  // у
  ['\u0455', ['s', 'Cyrillic']],  // ѕ
  ['\u0456', ['i', 'Cyrillic']],  // і
  ['\u0458', ['j', 'Cyrillic']],  // ј
  // Greek -> Latin
  ['\u0391', ['A', 'Greek']],     // Α
  ['\u0392', ['B', 'Greek']],     // Β
  ['\u0395', ['E', 'Greek']],     // Ε
  ['\u0396', ['Z', 'Greek']],     // Ζ
  ['\u0397', ['H', 'Greek']],     // Η
  ['\u0399', ['I', 'Greek']],     // Ι
  ['\u039A', ['K', 'Greek']],     // Κ
  ['\u039C', ['M', 'Greek']],     // Μ
  ['\u039D', ['N', 'Greek']],     // Ν
  ['\u039F', ['O', 'Greek']],     // Ο
  ['\u03A1', ['P', 'Greek']],     // Ρ
  ['\u03A4', ['T', 'Greek']],     // Τ
  ['\u03A5', ['Y', 'Greek']],     // Υ
  ['\u03A7', ['X', 'Greek']],     // Χ
  ['\u03BF', ['o', 'Greek']],     // ο
  // Fullwidth -> ASCII
  ['\uFF21', ['A', 'Fullwidth']], // Ａ
  ['\uFF22', ['B', 'Fullwidth']], // Ｂ
  ['\uFF23', ['C', 'Fullwidth']], // Ｃ
  // Zero-width and invisible
  ['\u200B', ['(none)', 'Zero-width space']],
  ['\u200C', ['(none)', 'Zero-width non-joiner']],
  ['\u200D', ['(none)', 'Zero-width joiner']],
  ['\u200E', ['(none)', 'Left-to-right mark']],
  ['\u200F', ['(none)', 'Right-to-left mark']],
  ['\uFEFF', ['(none)', 'BOM / Zero-width no-break space']],
]);

export function detectHomoglyphs(text: string): HomoglyphResult[] {
  const results: HomoglyphResult[] = [];
  const chars = [...text];

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const cp = char.codePointAt(0) || 0;
    const cpHex = 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');

    const confusable = CONFUSABLES.get(char);
    if (confusable) {
      const [latinEquiv, script] = confusable;
      const isInvisible = script.startsWith('Zero-width') || script === 'BOM / Zero-width no-break space';
      results.push({
        index: i,
        char: isInvisible ? `[${script}]` : char,
        codePoint: cpHex,
        script,
        confusableWith: latinEquiv,
        confusableScript: 'Latin',
        risk: isInvisible ? 'high' : 'medium',
      });
    } else {
      // Check for mixed scripts
      const charScript = getScript(cp);
      if (charScript !== 'Latin' && charScript !== 'Common' && charScript !== 'Unknown') {
        // Check if there are Latin characters in the text
        const hasLatin = chars.some((c) => {
          const p = c.codePointAt(0) || 0;
          return getScript(p) === 'Latin';
        });
        if (hasLatin) {
          results.push({
            index: i,
            char,
            codePoint: cpHex,
            script: charScript,
            confusableWith: '(mixed script)',
            confusableScript: 'Latin',
            risk: 'low',
          });
        }
      }
    }
  }

  return results;
}

function getScript(cp: number): string {
  if ((cp >= 0x41 && cp <= 0x5a) || (cp >= 0x61 && cp <= 0x7a)) return 'Latin';
  if (cp >= 0xc0 && cp <= 0x024f) return 'Latin';
  if (cp >= 0x0400 && cp <= 0x04ff) return 'Cyrillic';
  if (cp >= 0x0370 && cp <= 0x03ff) return 'Greek';
  if (cp >= 0x0600 && cp <= 0x06ff) return 'Arabic';
  if (cp >= 0x0590 && cp <= 0x05ff) return 'Hebrew';
  if (cp >= 0x3040 && cp <= 0x309f) return 'Hiragana';
  if (cp >= 0x30a0 && cp <= 0x30ff) return 'Katakana';
  if (cp >= 0x4e00 && cp <= 0x9fff) return 'CJK';
  if (cp >= 0xac00 && cp <= 0xd7af) return 'Hangul';
  if (cp >= 0xff00 && cp <= 0xffef) return 'Fullwidth';
  if (cp <= 0x7f) return 'Common';
  return 'Unknown';
}

export function getSecurityLevel(results: HomoglyphResult[]): {
  level: 'safe' | 'warning' | 'danger';
  message: string;
} {
  const highRisk = results.filter((r) => r.risk === 'high').length;
  const mediumRisk = results.filter((r) => r.risk === 'medium').length;

  if (highRisk > 0) {
    return {
      level: 'danger',
      message: `Found ${highRisk} invisible/zero-width character(s). This text may be deceptive.`,
    };
  }
  if (mediumRisk > 0) {
    return {
      level: 'warning',
      message: `Found ${mediumRisk} visually confusable character(s) from different scripts.`,
    };
  }
  if (results.length > 0) {
    return {
      level: 'warning',
      message: 'Text contains mixed scripts which may be intentional.',
    };
  }
  return {
    level: 'safe',
    message: 'No confusable characters detected.',
  };
}
