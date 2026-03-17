export interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
  line: number | null;
}

export function validateHTML(html: string): ValidationIssue[] {
  if (!html.trim()) return [];
  const issues: ValidationIssue[] = [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const errors = doc.querySelectorAll('parsererror');
  if (errors.length > 0) {
    issues.push({ type: 'error', message: 'HTML parsing error detected', line: null });
  }

  const lines = html.split('\n');
  const openTags: string[] = [];
  const selfClosing = new Set([
    'br',
    'hr',
    'img',
    'input',
    'meta',
    'link',
    'area',
    'base',
    'col',
    'embed',
    'source',
    'track',
    'wbr',
  ]);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const tagMatches = line.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*\/?>/g);
    for (const match of tagMatches) {
      const tag = match[1].toLowerCase();
      const isClosing = match[0].startsWith('</');
      const isSelfClose = match[0].endsWith('/>') || selfClosing.has(tag);

      if (!isClosing && !isSelfClose) {
        openTags.push(tag);
      } else if (isClosing) {
        const lastOpen = openTags.pop();
        if (lastOpen && lastOpen !== tag) {
          issues.push({
            type: 'error',
            message: `Mismatched tag: expected </${lastOpen}> but found </${tag}>`,
            line: i + 1,
          });
          openTags.push(lastOpen);
        }
      }
    }

    if (line.includes('<img') && !line.includes('alt=')) {
      issues.push({ type: 'warning', message: 'img tag missing alt attribute', line: i + 1 });
    }
  }

  if (openTags.length > 0) {
    for (const tag of openTags) {
      issues.push({ type: 'error', message: `Unclosed tag: <${tag}>`, line: null });
    }
  }

  if (!html.includes('<!DOCTYPE') && !html.includes('<!doctype')) {
    issues.push({ type: 'warning', message: 'Missing DOCTYPE declaration', line: null });
  }

  return issues;
}
