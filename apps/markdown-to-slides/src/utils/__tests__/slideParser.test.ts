import { describe, it, expect } from 'vitest';
import { parseSlides, renderMarkdown } from '../slideParser';

describe('parseSlides', () => {
  it('splits slides by ---', () => {
    const md = '# Slide 1\n---\n# Slide 2\n---\n# Slide 3';
    const slides = parseSlides(md);
    expect(slides).toHaveLength(3);
    expect(slides[0].content).toBe('# Slide 1');
    expect(slides[1].content).toBe('# Slide 2');
    expect(slides[2].content).toBe('# Slide 3');
  });

  it('returns empty array for empty input', () => {
    expect(parseSlides('')).toEqual([]);
  });

  it('handles single slide', () => {
    const slides = parseSlides('# Only Slide');
    expect(slides).toHaveLength(1);
  });

  it('generates HTML for each slide', () => {
    const slides = parseSlides('# Title');
    expect(slides[0].html).toContain('<h1>');
  });
});

describe('renderMarkdown', () => {
  it('renders headings', () => {
    expect(renderMarkdown('# H1')).toContain('<h1>H1</h1>');
    expect(renderMarkdown('## H2')).toContain('<h2>H2</h2>');
    expect(renderMarkdown('### H3')).toContain('<h3>H3</h3>');
  });

  it('renders bold text', () => {
    expect(renderMarkdown('**bold**')).toContain('<strong>bold</strong>');
  });

  it('renders italic text', () => {
    expect(renderMarkdown('*italic*')).toContain('<em>italic</em>');
  });

  it('renders inline code', () => {
    expect(renderMarkdown('`code`')).toContain('<code>code</code>');
  });

  it('renders code blocks', () => {
    const result = renderMarkdown('```js\nconst x = 1;\n```');
    expect(result).toContain('<pre><code');
    expect(result).toContain('language-js');
  });

  it('renders links', () => {
    const result = renderMarkdown('[text](https://example.com)');
    expect(result).toContain('<a href="https://example.com"');
    expect(result).toContain('text</a>');
  });

  it('renders images', () => {
    const result = renderMarkdown('![alt](image.png)');
    expect(result).toContain('<img src="image.png"');
    expect(result).toContain('alt="alt"');
  });

  it('renders unordered lists', () => {
    const result = renderMarkdown('- item 1\n- item 2');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li');
    expect(result).toContain('item 1');
  });

  it('renders blockquotes', () => {
    const result = renderMarkdown('> quoted text');
    expect(result).toContain('<blockquote>');
    expect(result).toContain('quoted text');
  });
});
