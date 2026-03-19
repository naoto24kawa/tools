export interface InvisibleChar {
  char: string;
  codePoint: string;
  name: string;
  type: InvisibleCharType;
  position: number;
}

export type InvisibleCharType =
  | 'zero-width-space'
  | 'zero-width-joiner'
  | 'bom'
  | 'soft-hyphen'
  | 'control-char'
  | 'other-invisible';

export interface DetectionResult {
  invisibleChars: InvisibleChar[];
  countByType: Record<InvisibleCharType, number>;
  totalCount: number;
}

const INVISIBLE_CHAR_MAP: Record<number, { name: string; type: InvisibleCharType }> = {
  0x200b: { name: 'Zero Width Space', type: 'zero-width-space' },
  0x200c: { name: 'Zero Width Non-Joiner', type: 'zero-width-joiner' },
  0x200d: { name: 'Zero Width Joiner', type: 'zero-width-joiner' },
  0x200e: { name: 'Left-to-Right Mark', type: 'other-invisible' },
  0x200f: { name: 'Right-to-Left Mark', type: 'other-invisible' },
  0x2028: { name: 'Line Separator', type: 'other-invisible' },
  0x2029: { name: 'Paragraph Separator', type: 'other-invisible' },
  0x202a: { name: 'Left-to-Right Embedding', type: 'other-invisible' },
  0x202b: { name: 'Right-to-Left Embedding', type: 'other-invisible' },
  0x202c: { name: 'Pop Directional Formatting', type: 'other-invisible' },
  0x202d: { name: 'Left-to-Right Override', type: 'other-invisible' },
  0x202e: { name: 'Right-to-Left Override', type: 'other-invisible' },
  0x2060: { name: 'Word Joiner', type: 'zero-width-joiner' },
  0x2061: { name: 'Function Application', type: 'other-invisible' },
  0x2062: { name: 'Invisible Times', type: 'other-invisible' },
  0x2063: { name: 'Invisible Separator', type: 'other-invisible' },
  0x2064: { name: 'Invisible Plus', type: 'other-invisible' },
  0xfeff: { name: 'Byte Order Mark (BOM)', type: 'bom' },
  0x00ad: { name: 'Soft Hyphen', type: 'soft-hyphen' },
  0x00a0: { name: 'Non-Breaking Space', type: 'other-invisible' },
  0x180e: { name: 'Mongolian Vowel Separator', type: 'other-invisible' },
  0x034f: { name: 'Combining Grapheme Joiner', type: 'zero-width-joiner' },
  0xffa0: { name: 'Halfwidth Hangul Filler', type: 'other-invisible' },
};

function isControlChar(codePoint: number): boolean {
  return (codePoint >= 0x00 && codePoint <= 0x08) ||
    (codePoint >= 0x0e && codePoint <= 0x1f) ||
    codePoint === 0x7f ||
    (codePoint >= 0x80 && codePoint <= 0x9f);
}

/**
 * Detect invisible characters in text.
 */
export function detect(text: string): DetectionResult {
  const invisibleChars: InvisibleChar[] = [];
  const countByType: Record<InvisibleCharType, number> = {
    'zero-width-space': 0,
    'zero-width-joiner': 0,
    'bom': 0,
    'soft-hyphen': 0,
    'control-char': 0,
    'other-invisible': 0,
  };

  for (let i = 0; i < text.length; i++) {
    const codePoint = text.codePointAt(i);
    if (codePoint === undefined) continue;

    const mapped = INVISIBLE_CHAR_MAP[codePoint];
    if (mapped) {
      invisibleChars.push({
        char: text[i],
        codePoint: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
        name: mapped.name,
        type: mapped.type,
        position: i,
      });
      countByType[mapped.type]++;
    } else if (isControlChar(codePoint)) {
      invisibleChars.push({
        char: text[i],
        codePoint: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
        name: `Control Character`,
        type: 'control-char',
        position: i,
      });
      countByType['control-char']++;
    }
  }

  return {
    invisibleChars,
    countByType,
    totalCount: invisibleChars.length,
  };
}

/**
 * Remove all invisible characters from text.
 */
export function clean(text: string): string {
  const result = detect(text);
  if (result.totalCount === 0) return text;

  const positions = new Set(result.invisibleChars.map((c) => c.position));
  return Array.from(text)
    .filter((_, i) => !positions.has(i))
    .join('');
}

/**
 * Remove only specific types of invisible characters.
 */
export function cleanByTypes(text: string, types: InvisibleCharType[]): string {
  const result = detect(text);
  if (result.totalCount === 0) return text;

  const typeSet = new Set(types);
  const positions = new Set(
    result.invisibleChars.filter((c) => typeSet.has(c.type)).map((c) => c.position)
  );

  return Array.from(text)
    .filter((_, i) => !positions.has(i))
    .join('');
}
