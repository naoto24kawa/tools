const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);
const INDENT_AFTER = new Set([
  'html',
  'head',
  'body',
  'div',
  'section',
  'article',
  'aside',
  'header',
  'footer',
  'main',
  'nav',
  'ul',
  'ol',
  'li',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'form',
  'fieldset',
  'select',
  'details',
  'summary',
  'dialog',
  'template',
  'blockquote',
  'figure',
  'figcaption',
  'dl',
  'dd',
  'dt',
]);

function shouldIndentAfterTag(tag: string): boolean {
  const tagMatch = tag.match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
  if (!tagMatch) return false;
  const tagName = tagMatch[1].toLowerCase();
  return !VOID_ELEMENTS.has(tagName) && !tag.endsWith('/>') && INDENT_AFTER.has(tagName);
}

function processPart(part: string, level: number, indent: string, lines: string[]): number {
  const trimmed = part.trim();
  if (!trimmed) return level;

  if (trimmed.startsWith('</')) {
    const newLevel = Math.max(0, level - 1);
    lines.push(indent.repeat(newLevel) + trimmed);
    return newLevel;
  }

  if (trimmed.startsWith('<')) {
    lines.push(indent.repeat(level) + trimmed);
    return shouldIndentAfterTag(trimmed) ? level + 1 : level;
  }

  lines.push(indent.repeat(level) + trimmed);
  return level;
}

export function formatHtml(html: string, indentSize: number = 2): string {
  const trimmed = html.trim();
  if (!trimmed) return '';

  const indent = ' '.repeat(indentSize);
  let level = 0;
  const lines: string[] = [];

  const tokens = trimmed.replace(/>\s+</g, '>\n<').split('\n');

  for (const rawToken of tokens) {
    const token = rawToken.trim();
    if (!token) continue;

    const parts = token.match(/<[^>]+>|[^<]+/g) || [token];

    for (const part of parts) {
      level = processPart(part, level, indent, lines);
    }
  }

  return lines.join('\n');
}

export function minifyHtml(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return '';

  return trimmed
    .replace(/\n/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}
