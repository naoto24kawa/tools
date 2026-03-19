export type Segment =
  | { type: 'text'; text: string }
  | { type: 'ruby'; text: string; reading: string };

/**
 * {漢字|かんじ} 形式のルビ記法をパースしてセグメントに分割
 */
export function parse(input: string): Segment[] {
  if (!input) return [];

  const segments: Segment[] = [];
  const pattern = /\{([^|]+)\|([^}]+)\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', text: input.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'ruby', text: match[1], reading: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < input.length) {
    segments.push({ type: 'text', text: input.slice(lastIndex) });
  }

  return segments;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * セグメント配列をHTMLに変換
 */
export function toHtml(segments: Segment[]): string {
  return segments
    .map((seg) => {
      if (seg.type === 'ruby') {
        const text = escapeHtml(seg.text);
        const reading = escapeHtml(seg.reading);
        return `<ruby>${text}<rp>(</rp><rt>${reading}</rt><rp>)</rp></ruby>`;
      }
      return escapeHtml(seg.text);
    })
    .join('');
}

/**
 * ルビ記法テキストを直接HTMLに変換
 */
export function convertToHtml(input: string): string {
  return toHtml(parse(input));
}
