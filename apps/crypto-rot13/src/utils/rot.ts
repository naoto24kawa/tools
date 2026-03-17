function rotateChar(char: string, shift: number, base: number, range: number): string {
  const code = char.charCodeAt(0);
  return String.fromCharCode(((code - base + shift) % range) + base);
}

export function rot13(text: string): string {
  return [...text]
    .map((c) => {
      if (c >= 'A' && c <= 'Z') return rotateChar(c, 13, 65, 26);
      if (c >= 'a' && c <= 'z') return rotateChar(c, 13, 97, 26);
      return c;
    })
    .join('');
}

export function rot18(text: string): string {
  return [...text]
    .map((c) => {
      if (c >= 'A' && c <= 'Z') return rotateChar(c, 13, 65, 26);
      if (c >= 'a' && c <= 'z') return rotateChar(c, 13, 97, 26);
      if (c >= '0' && c <= '9') return rotateChar(c, 5, 48, 10);
      return c;
    })
    .join('');
}

export function rot47(text: string): string {
  return [...text]
    .map((c) => {
      const code = c.charCodeAt(0);
      if (code >= 33 && code <= 126) {
        return String.fromCharCode(((code - 33 + 47) % 94) + 33);
      }
      return c;
    })
    .join('');
}

const ROT_OPTIONS = [
  { value: 'rot13', label: 'ROT13', description: 'A-Z/a-zを13文字シフト', fn: rot13 },
  { value: 'rot18', label: 'ROT18', description: 'ROT13 + 数字を5シフト', fn: rot18 },
  { value: 'rot47', label: 'ROT47', description: 'ASCII 33-126を47シフト', fn: rot47 },
] as const;

export { ROT_OPTIONS };

export type RotType = (typeof ROT_OPTIONS)[number]['value'];
