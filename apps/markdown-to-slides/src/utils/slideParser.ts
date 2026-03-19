export interface Slide {
  content: string;
  html: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderMarkdown(md: string): string {
  // Escape all HTML first to prevent XSS, then apply Markdown transformations
  let html = escapeHtml(md);

  // Code blocks (must be before inline code) - escape HTML inside code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const langAttr = lang ? ` class="language-${lang}"` : '';
    return `<pre><code${langAttr}>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Images
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" style="max-width:100%;max-height:60vh;">',
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>',
  );

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr>');

  // Unordered lists
  html = html.replace(/^(\s*)[-*]\s+(.+)$/gm, (_match, indent, content) => {
    const level = Math.floor(indent.length / 2);
    return `<li data-level="${level}">${content}</li>`;
  });
  // Wrap consecutive li elements in ul
  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Ordered lists
  html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<oli>$2</oli>');
  html = html.replace(/((?:<oli>.*<\/oli>\n?)+)/g, (_match, items) => {
    return '<ol>' + items.replace(/<oli>/g, '<li>').replace(/<\/oli>/g, '</li>') + '</ol>';
  });

  // Blockquote
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '<br>');

  // Paragraphs for remaining text
  const lines = html.split('\n');
  const processed: string[] = [];
  let inBlock = false;

  for (const line of lines) {
    if (line.match(/^<(h[1-6]|ul|ol|li|pre|blockquote|hr|img|div)/)) {
      inBlock = true;
      processed.push(line);
    } else if (line.match(/^<\/(ul|ol|pre|blockquote)/)) {
      inBlock = false;
      processed.push(line);
    } else if (inBlock || line.trim() === '') {
      processed.push(line);
    } else if (line.trim() && !line.startsWith('<')) {
      processed.push(`<p>${line}</p>`);
    } else {
      processed.push(line);
    }
  }

  return processed.join('\n');
}

export function parseSlides(markdown: string): Slide[] {
  if (!markdown.trim()) {
    return [];
  }

  // Split by --- on its own line (slide separator)
  const parts = markdown.split(/\n---\n/);

  return parts.map((content) => ({
    content: content.trim(),
    html: renderMarkdown(content.trim()),
  }));
}
