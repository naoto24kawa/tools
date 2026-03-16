export interface BionicOptions {
  fixationRatio: number;
}

export const DEFAULT_OPTIONS: BionicOptions = {
  fixationRatio: 0.5,
};

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function toBionicWord(word: string, ratio: number): string {
  if (word.length === 0) return '';
  const boldLength = Math.max(1, Math.ceil(word.length * ratio));
  const bold = escapeHTML(word.slice(0, boldLength));
  const rest = escapeHTML(word.slice(boldLength));
  return `<b>${bold}</b>${rest}`;
}

export function toBionicHTML(text: string, options: BionicOptions): string {
  const { fixationRatio } = options;
  return text
    .split('\n')
    .map((line) => line.replace(/\S+/g, (word) => toBionicWord(word, fixationRatio)))
    .join('<br>');
}

export function toBionicMarkdown(text: string, options: BionicOptions): string {
  const { fixationRatio } = options;
  return text
    .split('\n')
    .map((line) =>
      line.replace(/\S+/g, (word) => {
        if (word.length === 0) return '';
        const boldLength = Math.max(1, Math.ceil(word.length * fixationRatio));
        const bold = word.slice(0, boldLength);
        const rest = word.slice(boldLength);
        return `**${bold}**${rest}`;
      })
    )
    .join('\n');
}
