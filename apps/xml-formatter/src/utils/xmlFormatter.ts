function classifyPart(
  part: string
): 'processing' | 'closing' | 'selfClosing' | 'opening' | 'other' {
  if (part.startsWith('<?')) return 'processing';
  if (part.startsWith('</')) return 'closing';
  if (part.endsWith('/>')) return 'selfClosing';
  if (part.startsWith('<') && !part.startsWith('<!--')) return 'opening';
  return 'other';
}

export function formatXml(xml: string, indentSize: number = 2): string {
  const indent = ' '.repeat(indentSize);
  let level = 0;
  const lines: string[] = [];

  const parts = xml.replace(/>\s*</g, '>\n<').split('\n');

  for (const rawPart of parts) {
    const part = rawPart.trim();
    if (!part) continue;

    const type = classifyPart(part);

    if (type === 'closing') {
      level = Math.max(0, level - 1);
    }

    lines.push(indent.repeat(level) + part);

    if (type === 'opening' && !part.includes('</')) {
      level++;
    }
  }

  return lines.join('\n');
}

export function minifyXml(xml: string): string {
  return xml
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim();
}
