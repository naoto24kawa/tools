export function textToUnicodeEscape(text: string): string {
  return [...text]
    .map((char) => {
      const code = char.codePointAt(0);
      if (code === undefined) return char;
      if (code <= 0xffff) return `\\u${code.toString(16).padStart(4, '0')}`;
      return `\\u{${code.toString(16)}}`;
    })
    .join('');
}

export function unicodeEscapeToText(escaped: string): string {
  return escaped
    .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_m, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_m, hex) => String.fromCodePoint(Number.parseInt(hex, 16)));
}

export function textToCodePoints(text: string): string {
  return [...text]
    .map((char) => `U+${(char.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, '0')}`)
    .join(' ');
}
