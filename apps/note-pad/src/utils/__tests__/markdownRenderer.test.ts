import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../markdownRenderer';

describe('renderMarkdown', () => {
  it('renders headings', () => {
    expect(renderMarkdown('# Hello')).toContain('<h1>Hello</h1>');
    expect(renderMarkdown('## World')).toContain('<h2>World</h2>');
    expect(renderMarkdown('### Sub')).toContain('<h3>Sub</h3>');
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

  it('renders links', () => {
    const result = renderMarkdown('[Google](https://google.com)');
    expect(result).toContain('href="https://google.com"');
    expect(result).toContain('>Google</a>');
  });

  it('renders horizontal rules', () => {
    expect(renderMarkdown('---')).toContain('<hr>');
  });

  it('escapes HTML', () => {
    expect(renderMarkdown('<script>alert("xss")</script>')).not.toContain('<script>');
    expect(renderMarkdown('<script>')).toContain('&lt;script&gt;');
  });
});
