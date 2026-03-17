import { describe, expect, test } from 'bun:test';
import { markdownToHtml } from '../markdown';

describe('markdownToHtml', () => {
  test('heading', () => {
    expect(markdownToHtml('# Title')).toContain('<h1>Title</h1>');
  });
  test('bold', () => {
    expect(markdownToHtml('**bold**')).toContain('<strong>bold</strong>');
  });
  test('link', () => {
    expect(markdownToHtml('[x](y)')).toContain('<a href="y">x</a>');
  });
  test('empty', () => {
    expect(markdownToHtml('')).toBe('');
  });
});
