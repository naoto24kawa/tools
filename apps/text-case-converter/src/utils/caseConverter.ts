export type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'toggle' | 'capitalize';

export function toUpperCase(text: string): string {
  return text.toUpperCase();
}

export function toLowerCase(text: string): string {
  return text.toLowerCase();
}

export function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

export function toSentenceCase(text: string): string {
  return text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (match) => match.toUpperCase());
}

export function toToggleCase(text: string): string {
  return text
    .split('')
    .map((char) => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      }
      return char.toUpperCase();
    })
    .join('');
}

export function toCapitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function convertCase(text: string, caseType: CaseType): string {
  switch (caseType) {
    case 'upper':
      return toUpperCase(text);
    case 'lower':
      return toLowerCase(text);
    case 'title':
      return toTitleCase(text);
    case 'sentence':
      return toSentenceCase(text);
    case 'toggle':
      return toToggleCase(text);
    case 'capitalize':
      return toCapitalizeWords(text);
  }
}

export const CASE_OPTIONS: { value: CaseType; label: string; description: string }[] = [
  { value: 'upper', label: 'UPPER CASE', description: '全て大文字に変換' },
  { value: 'lower', label: 'lower case', description: '全て小文字に変換' },
  { value: 'title', label: 'Title Case', description: '各単語の先頭を大文字に' },
  { value: 'sentence', label: 'Sentence case', description: '文頭のみ大文字に' },
  { value: 'toggle', label: 'tOGGLE cASE', description: '大文字小文字を反転' },
  { value: 'capitalize', label: 'Capitalize Words', description: '各単語の先頭を大文字に' },
];
