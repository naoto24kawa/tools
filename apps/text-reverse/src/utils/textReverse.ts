const REVERSE_MODE_OPTIONS = [
  { value: 'characters', label: '文字単位', description: '文字列を1文字ずつ反転' },
  { value: 'words', label: '単語単位', description: '単語の順序を反転' },
  { value: 'lines', label: '行単位', description: '行の順序を反転' },
] as const;

export { REVERSE_MODE_OPTIONS };

export type ReverseMode = (typeof REVERSE_MODE_OPTIONS)[number]['value'];

export function reverseCharacters(text: string): string {
  return [...text].reverse().join('');
}

export function reverseWords(text: string): string {
  return text
    .split('\n')
    .map((line) => line.split(/\s+/).reverse().join(' '))
    .join('\n');
}

export function reverseLines(text: string): string {
  return text.split('\n').reverse().join('\n');
}

export function reverseText(text: string, mode: ReverseMode): string {
  switch (mode) {
    case 'characters':
      return reverseCharacters(text);
    case 'words':
      return reverseWords(text);
    case 'lines':
      return reverseLines(text);
    default: {
      const _exhaustiveCheck: never = mode;
      throw new Error(`Unsupported reverse mode: ${_exhaustiveCheck}`);
    }
  }
}
