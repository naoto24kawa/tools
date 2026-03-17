const KANA_MODE_OPTIONS = [
  { value: 'toKatakana', label: 'カタカナに変換', description: 'ひらがなをカタカナに変換' },
  { value: 'toHiragana', label: 'ひらがなに変換', description: 'カタカナをひらがなに変換' },
] as const;

export { KANA_MODE_OPTIONS };

export type KanaMode = (typeof KANA_MODE_OPTIONS)[number]['value'];

export function toKatakana(text: string): string {
  return text.replace(/[\u3041-\u3096\u309D-\u309F]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) + 0x60)
  );
}

export function toHiragana(text: string): string {
  return text.replace(/[\u30A1-\u30F6\u30FD-\u30FF]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x60)
  );
}

export function convertKana(text: string, mode: KanaMode): string {
  switch (mode) {
    case 'toKatakana':
      return toKatakana(text);
    case 'toHiragana':
      return toHiragana(text);
    default: {
      const _exhaustiveCheck: never = mode;
      throw new Error(`Unsupported kana mode: ${_exhaustiveCheck}`);
    }
  }
}
