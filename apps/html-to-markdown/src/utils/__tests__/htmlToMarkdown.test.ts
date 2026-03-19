// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { convert } from '../htmlToMarkdown';

describe('htmlToMarkdown', () => {
  it('converts headings', () => {
    expect(convert('<h1>Title</h1>')).toContain('# Title');
    expect(convert('<h2>Subtitle</h2>')).toContain('## Subtitle');
    expect(convert('<h3>Section</h3>')).toContain('### Section');
  });

  it('converts paragraphs', () => {
    const result = convert('<p>Hello World</p>');
    expect(result).toContain('Hello World');
  });

  it('converts bold text', () => {
    expect(convert('<strong>bold</strong>')).toContain('**bold**');
    expect(convert('<b>bold</b>')).toContain('**bold**');
  });

  it('converts italic text', () => {
    expect(convert('<em>italic</em>')).toContain('*italic*');
    expect(convert('<i>italic</i>')).toContain('*italic*');
  });

  it('converts links', () => {
    const result = convert('<a href="https://example.com">Example</a>');
    expect(result).toContain('[Example](https://example.com)');
  });

  it('converts images', () => {
    const result = convert('<img src="image.png" alt="Alt text">');
    expect(result).toContain('![Alt text](image.png)');
  });

  it('converts unordered lists', () => {
    const result = convert('<ul><li>Item 1</li><li>Item 2</li></ul>');
    expect(result).toContain('- Item 1');
    expect(result).toContain('- Item 2');
  });

  it('converts ordered lists', () => {
    const result = convert('<ol><li>First</li><li>Second</li></ol>');
    expect(result).toContain('1. First');
    expect(result).toContain('2. Second');
  });

  it('converts inline code', () => {
    const result = convert('<code>const x = 1</code>');
    expect(result).toContain('`const x = 1`');
  });

  it('converts code blocks', () => {
    const result = convert('<pre><code>function hello() {\n  return "hi";\n}</code></pre>');
    expect(result).toContain('```');
    expect(result).toContain('function hello()');
  });

  it('converts code blocks with language', () => {
    const result = convert('<pre><code class="language-javascript">const x = 1;</code></pre>');
    expect(result).toContain('```javascript');
  });

  it('converts blockquotes', () => {
    const result = convert('<blockquote>Quote text</blockquote>');
    expect(result).toContain('> Quote text');
  });

  it('converts horizontal rules', () => {
    const result = convert('<hr>');
    expect(result).toContain('---');
  });

  it('converts tables', () => {
    const result = convert('<table><tr><th>Name</th><th>Age</th></tr><tr><td>Alice</td><td>30</td></tr></table>');
    expect(result).toContain('| Name');
    expect(result).toContain('| Alice');
    expect(result).toContain('---');
  });

  it('throws on empty input', () => {
    expect(() => convert('')).toThrow('Input is empty');
  });

  it('converts strikethrough', () => {
    expect(convert('<del>deleted</del>')).toContain('~~deleted~~');
  });
});
