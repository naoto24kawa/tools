function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function valueToXml(key: string, value: unknown, indent: number): string {
  const pad = '  '.repeat(indent);
  const tag = key.replace(/[^a-zA-Z0-9_-]/g, '_');

  if (value === null || value === undefined) {
    return `${pad}<${tag}/>\n`;
  }
  if (typeof value === 'boolean' || typeof value === 'number') {
    return `${pad}<${tag}>${value}</${tag}>\n`;
  }
  if (typeof value === 'string') {
    return `${pad}<${tag}>${escapeXml(value)}</${tag}>\n`;
  }
  if (Array.isArray(value)) {
    return value.map((item) => valueToXml(tag, item, indent)).join('');
  }
  if (typeof value === 'object') {
    const children = Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => valueToXml(k, v, indent + 1))
      .join('');
    return `${pad}<${tag}>\n${children}${pad}</${tag}>\n`;
  }
  return `${pad}<${tag}>${String(value)}</${tag}>\n`;
}

export function jsonToXml(
  jsonStr: string,
  rootTag = 'root'
): { xml: string; error: string | null } {
  if (!jsonStr.trim()) return { xml: '', error: null };
  try {
    const parsed = JSON.parse(jsonStr);
    const inner =
      typeof parsed === 'object' && !Array.isArray(parsed)
        ? Object.entries(parsed as Record<string, unknown>)
            .map(([k, v]) => valueToXml(k, v, 1))
            .join('')
        : valueToXml('item', parsed, 1);
    return {
      xml: `<?xml version="1.0" encoding="UTF-8"?>\n<${rootTag}>\n${inner}</${rootTag}>`,
      error: null,
    };
  } catch (e) {
    return { xml: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}
