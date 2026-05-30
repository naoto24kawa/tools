import { describe, expect, it } from 'vitest';
import { convertMarkdownToFragment, convertMarkdownToHtml } from '../markdownConverter';

describe('convertMarkdownToHtml', () => {
  it('空文字を渡すと空文字を返す', () => {
    expect(convertMarkdownToHtml('')).toBe('');
  });

  it('h1 見出しを変換する', () => {
    const result = convertMarkdownToHtml('# Hello');
    expect(result).toContain('<h1>Hello</h1>');
  });

  it('h2 見出しを変換する', () => {
    const result = convertMarkdownToHtml('## World');
    expect(result).toContain('<h2>World</h2>');
  });

  it('箇条書きを変換する', () => {
    const result = convertMarkdownToHtml('- item1\n- item2');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>item1</li>');
  });

  it('コードブロックを変換する', () => {
    const result = convertMarkdownToHtml('```js\nconsole.log("hi")\n```');
    expect(result).toContain('<pre>');
    expect(result).toContain('<code');
  });

  it('インラインコードを変換する', () => {
    const result = convertMarkdownToHtml('use `npm install`');
    expect(result).toContain('<code>npm install</code>');
  });

  it('GFM テーブルを変換する', () => {
    const md = '| A | B |\n|---|---|\n| 1 | 2 |';
    const result = convertMarkdownToHtml(md);
    expect(result).toContain('<table>');
    expect(result).toContain('<th>');
  });

  it('script タグを除去してXSSを防ぐ', () => {
    const result = convertMarkdownToHtml('<script>alert(1)</script>');
    expect(result).not.toContain('<script>');
  });

  it('onerror 属性を除去する', () => {
    const result = convertMarkdownToHtml('<img onerror="alert(1)" src="x">');
    expect(result).not.toContain('onerror');
  });
});

describe('convertMarkdownToFragment', () => {
  it('DocumentFragment を返す', () => {
    const fragment = convertMarkdownToFragment('# Hello');
    expect(fragment).toBeInstanceOf(DocumentFragment);
  });

  it('h1 要素を含む Fragment を返す', () => {
    const fragment = convertMarkdownToFragment('# Hello');
    const div = document.createElement('div');
    div.appendChild(fragment.cloneNode(true));
    expect(div.querySelector('h1')).not.toBeNull();
  });

  it('空文字の場合も DocumentFragment を返す', () => {
    const fragment = convertMarkdownToFragment('');
    expect(fragment).toBeInstanceOf(DocumentFragment);
  });
});
