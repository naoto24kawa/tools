export interface CharInfo {
  char: string;
  codePoint: string;
  utf8Bytes: string;
  utf16: string;
  category: string;
  name: string;
  block: string;
}

export function inspectCharacter(char: string): CharInfo {
  const codePoint = char.codePointAt(0) || 0;
  const cpHex = 'U+' + codePoint.toString(16).toUpperCase().padStart(4, '0');

  // UTF-8 bytes
  const encoder = new TextEncoder();
  const bytes = encoder.encode(char);
  const utf8Bytes = Array.from(bytes)
    .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
    .join(' ');

  // UTF-16
  const utf16Units: string[] = [];
  for (let i = 0; i < char.length; i++) {
    utf16Units.push(char.charCodeAt(i).toString(16).toUpperCase().padStart(4, '0'));
  }
  const utf16 = utf16Units.join(' ');

  const category = getCategory(codePoint);
  const name = getCharName(codePoint);
  const block = getUnicodeBlock(codePoint);

  return {
    char,
    codePoint: cpHex,
    utf8Bytes,
    utf16,
    category,
    name,
    block,
  };
}

export function inspectText(text: string): CharInfo[] {
  const result: CharInfo[] = [];
  const chars = [...text]; // Handle surrogate pairs
  for (const char of chars) {
    result.push(inspectCharacter(char));
  }
  return result;
}

function getCategory(cp: number): string {
  if (cp >= 0x0000 && cp <= 0x001f) return 'Cc (Control)';
  if (cp >= 0x0020 && cp <= 0x007e) {
    if (cp >= 0x30 && cp <= 0x39) return 'Nd (Decimal Number)';
    if ((cp >= 0x41 && cp <= 0x5a) || (cp >= 0x61 && cp <= 0x7a)) return 'L (Letter)';
    if (cp === 0x20) return 'Zs (Space Separator)';
    return 'P/S (Punctuation/Symbol)';
  }
  if (cp >= 0x0080 && cp <= 0x009f) return 'Cc (Control)';
  if (cp >= 0x00a0 && cp <= 0x00ff) return 'L/S (Latin-1 Supplement)';
  if (cp >= 0x0300 && cp <= 0x036f) return 'Mn (Combining Mark)';
  if (cp >= 0x0370 && cp <= 0x03ff) return 'L (Greek)';
  if (cp >= 0x0400 && cp <= 0x04ff) return 'L (Cyrillic)';
  if (cp >= 0x0590 && cp <= 0x05ff) return 'L (Hebrew)';
  if (cp >= 0x0600 && cp <= 0x06ff) return 'L (Arabic)';
  if (cp >= 0x3000 && cp <= 0x303f) return 'P (CJK Symbols)';
  if (cp >= 0x3040 && cp <= 0x309f) return 'Lo (Hiragana)';
  if (cp >= 0x30a0 && cp <= 0x30ff) return 'Lo (Katakana)';
  if (cp >= 0x4e00 && cp <= 0x9fff) return 'Lo (CJK Ideograph)';
  if (cp >= 0xac00 && cp <= 0xd7af) return 'Lo (Hangul)';
  if (cp >= 0xfe00 && cp <= 0xfe0f) return 'Mn (Variation Selector)';
  if (cp >= 0xff00 && cp <= 0xffef) return 'L/S (Fullwidth Forms)';
  if (cp >= 0x1f000 && cp <= 0x1ffff) return 'So (Emoji/Symbols)';
  if (cp >= 0x20000 && cp <= 0x2a6df) return 'Lo (CJK Extension B)';
  return 'Other';
}

function getCharName(cp: number): string {
  if (cp === 0x0a) return 'LINE FEED';
  if (cp === 0x0d) return 'CARRIAGE RETURN';
  if (cp === 0x09) return 'HORIZONTAL TAB';
  if (cp === 0x20) return 'SPACE';
  if (cp === 0x00) return 'NULL';
  if (cp >= 0x0000 && cp <= 0x001f) return 'CONTROL CHARACTER';
  if (cp >= 0x0041 && cp <= 0x005a)
    return 'LATIN CAPITAL LETTER ' + String.fromCodePoint(cp);
  if (cp >= 0x0061 && cp <= 0x007a)
    return 'LATIN SMALL LETTER ' + String.fromCodePoint(cp);
  if (cp >= 0x0030 && cp <= 0x0039) return 'DIGIT ' + String.fromCodePoint(cp);
  if (cp >= 0x3041 && cp <= 0x3096) return 'HIRAGANA LETTER';
  if (cp >= 0x30a1 && cp <= 0x30f6) return 'KATAKANA LETTER';
  if (cp >= 0x4e00 && cp <= 0x9fff) return 'CJK UNIFIED IDEOGRAPH';
  if (cp >= 0x1f600 && cp <= 0x1f64f) return 'EMOTICON';
  if (cp >= 0x1f300 && cp <= 0x1f5ff) return 'MISCELLANEOUS SYMBOL';
  return 'CHARACTER U+' + cp.toString(16).toUpperCase().padStart(4, '0');
}

function getUnicodeBlock(cp: number): string {
  if (cp <= 0x007f) return 'Basic Latin';
  if (cp <= 0x00ff) return 'Latin-1 Supplement';
  if (cp <= 0x017f) return 'Latin Extended-A';
  if (cp <= 0x024f) return 'Latin Extended-B';
  if (cp <= 0x02af) return 'IPA Extensions';
  if (cp <= 0x036f) return 'Combining Diacritical Marks';
  if (cp <= 0x03ff) return 'Greek and Coptic';
  if (cp <= 0x04ff) return 'Cyrillic';
  if (cp <= 0x058f) return 'Armenian';
  if (cp <= 0x05ff) return 'Hebrew';
  if (cp <= 0x06ff) return 'Arabic';
  if (cp <= 0x109f) return 'Various Asian Scripts';
  if (cp <= 0x1fff) return 'Various Scripts';
  if (cp <= 0x206f) return 'General Punctuation';
  if (cp <= 0x2bff) return 'Symbols and Punctuation';
  if (cp <= 0x2fff) return 'CJK Radicals/Kangxi';
  if (cp <= 0x303f) return 'CJK Symbols and Punctuation';
  if (cp <= 0x309f) return 'Hiragana';
  if (cp <= 0x30ff) return 'Katakana';
  if (cp <= 0x31ff) return 'Bopomofo/Kanbun';
  if (cp <= 0x33ff) return 'CJK Compatibility';
  if (cp <= 0x4dbf) return 'CJK Extension A';
  if (cp <= 0x9fff) return 'CJK Unified Ideographs';
  if (cp <= 0xa4cf) return 'Yi Syllables/Radicals';
  if (cp <= 0xabff) return 'Various Scripts';
  if (cp <= 0xd7af) return 'Hangul Syllables';
  if (cp <= 0xfaff) return 'Various';
  if (cp <= 0xfb4f) return 'Alphabetic Presentation Forms';
  if (cp <= 0xfe0f) return 'Variation Selectors';
  if (cp <= 0xffef) return 'Halfwidth and Fullwidth Forms';
  if (cp <= 0x1f9ff) return 'Emoji and Symbols';
  if (cp <= 0x2a6df) return 'CJK Extension B';
  return 'Other';
}
