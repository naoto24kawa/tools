import { describe, expect, test } from 'bun:test';
import { markdownToHtml } from '../markdown';

describe('markdown', () => {
  test('h1', () => {
    expect(markdownToHtml('# Hello')).toContain('<h1>Hello</h1>');
  });
  test('h2', () => {
    expect(markdownToHtml('## Hello')).toContain('<h2>Hello</h2>');
  });
  test('bold', () => {
    expect(markdownToHtml('**bold**')).toContain('<strong>bold</strong>');
  });
  test('italic', () => {
    expect(markdownToHtml('*italic*')).toContain('<em>italic</em>');
  });
  test('inline code', () => {
    expect(markdownToHtml('`code`')).toContain('<code>code</code>');
  });
  test('link', () => {
    expect(markdownToHtml('[text](url)')).toContain('<a href="url">text</a>');
  });
  test('hr', () => {
    expect(markdownToHtml('---')).toContain('<hr>');
  });
  test('list', () => {
    expect(markdownToHtml('- item')).toContain('<li>item</li>');
  });
  test('blockquote', () => {
    expect(markdownToHtml('> quote')).toContain('<blockquote>quote</blockquote>');
  });
  test('empty', () => {
    expect(markdownToHtml('')).toBe('');
  });
});
