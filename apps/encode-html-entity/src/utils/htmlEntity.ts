const NAMED_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
  '\u00A0': '&nbsp;',
  '\u00A9': '&copy;',
  '\u00AE': '&reg;',
  '\u2122': '&trade;',
  '\u2026': '&hellip;',
  '\u2014': '&mdash;',
  '\u2013': '&ndash;',
  '\u2018': '&lsquo;',
  '\u2019': '&rsquo;',
  '\u201C': '&ldquo;',
  '\u201D': '&rdquo;',
};

const REVERSE_NAMED: Record<string, string> = {};
for (const [char, entity] of Object.entries(NAMED_ENTITIES)) {
  REVERSE_NAMED[entity] = char;
}

export function encodeHTMLEntities(text: string): string {
  return text.replace(
    /[&<>"'\u00A0\u00A9\u00AE\u2122\u2026\u2014\u2013\u2018\u2019\u201C\u201D]/g,
    (char) => NAMED_ENTITIES[char] ?? char
  );
}

export function encodeAllHTMLEntities(text: string): string {
  return [...text]
    .map((char) => {
      if (NAMED_ENTITIES[char]) return NAMED_ENTITIES[char];
      const code = char.codePointAt(0);
      if (code !== undefined && code > 127) return `&#${code};`;
      return char;
    })
    .join('');
}

export function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&\w+;/g, (entity) => REVERSE_NAMED[entity] ?? entity)
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_match, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16))
    );
}
