import { describe, it, expect } from 'vitest';
import {
  detectDelimiter,
  parseList,
  toHTML,
  toMarkdown,
  toCSV,
  convert,
} from '../listToTable';

describe('detectDelimiter', () => {
  it('detects comma delimiter', () => {
    expect(detectDelimiter('a,b,c')).toBe(',');
  });

  it('detects tab delimiter', () => {
    expect(detectDelimiter('a\tb\tc')).toBe('\t');
  });

  it('detects pipe delimiter', () => {
    expect(detectDelimiter('a|b|c')).toBe('|');
  });

  it('detects semicolon delimiter', () => {
    expect(detectDelimiter('a;b;c')).toBe(';');
  });

  it('defaults to comma when no delimiter found', () => {
    expect(detectDelimiter('abc')).toBe(',');
  });
});

describe('parseList', () => {
  it('parses comma-separated lines', () => {
    const result = parseList('a,b,c\n1,2,3', ',');
    expect(result).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ]);
  });

  it('parses tab-separated lines', () => {
    const result = parseList('a\tb\tc', '\t');
    expect(result).toEqual([['a', 'b', 'c']]);
  });

  it('parses pipe-separated lines', () => {
    const result = parseList('a|b|c', '|');
    expect(result).toEqual([['a', 'b', 'c']]);
  });

  it('skips empty lines', () => {
    const result = parseList('a,b\n\nc,d', ',');
    expect(result).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('trims whitespace from cells', () => {
    const result = parseList(' a , b , c ', ',');
    expect(result).toEqual([['a', 'b', 'c']]);
  });

  it('parses space-separated (2+ spaces) lines', () => {
    const result = parseList('a  b  c', ' ');
    expect(result).toEqual([['a', 'b', 'c']]);
  });
});

describe('toHTML', () => {
  it('generates HTML table with header', () => {
    const data = [
      ['Name', 'Age'],
      ['Alice', '30'],
    ];
    const html = toHTML(data, true);
    expect(html).toContain('<table>');
    expect(html).toContain('<thead>');
    expect(html).toContain('<th>Name</th>');
    expect(html).toContain('<th>Age</th>');
    expect(html).toContain('<td>Alice</td>');
    expect(html).toContain('<td>30</td>');
    expect(html).toContain('</table>');
  });

  it('generates HTML table without header', () => {
    const data = [
      ['Alice', '30'],
      ['Bob', '25'],
    ];
    const html = toHTML(data, false);
    expect(html).not.toContain('<thead>');
    expect(html).toContain('<td>Alice</td>');
  });

  it('escapes HTML special characters', () => {
    const data = [['<script>', '&test']];
    const html = toHTML(data, false);
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&amp;test');
  });

  it('returns empty string for empty data', () => {
    expect(toHTML([], true)).toBe('');
  });
});

describe('toMarkdown', () => {
  it('generates markdown table with header', () => {
    const data = [
      ['Name', 'Age'],
      ['Alice', '30'],
    ];
    const md = toMarkdown(data, true);
    expect(md).toContain('| Name');
    expect(md).toContain('| ---');
    expect(md).toContain('| Alice');
  });

  it('generates markdown table without header (auto-generates Col N)', () => {
    const data = [
      ['Alice', '30'],
      ['Bob', '25'],
    ];
    const md = toMarkdown(data, false);
    expect(md).toContain('Col 1');
    expect(md).toContain('Col 2');
    expect(md).toContain('Alice');
  });

  it('returns empty string for empty data', () => {
    expect(toMarkdown([], true)).toBe('');
  });
});

describe('toCSV', () => {
  it('generates CSV from data', () => {
    const data = [
      ['Name', 'Age'],
      ['Alice', '30'],
    ];
    const csv = toCSV(data);
    expect(csv).toBe('Name,Age\nAlice,30');
  });

  it('quotes cells containing commas', () => {
    const data = [['hello, world', 'test']];
    const csv = toCSV(data);
    expect(csv).toBe('"hello, world",test');
  });

  it('escapes double quotes', () => {
    const data = [['say "hi"', 'ok']];
    const csv = toCSV(data);
    expect(csv).toBe('"say ""hi""",ok');
  });
});

describe('convert', () => {
  it('converts to html format', () => {
    const result = convert('a,b\n1,2', ',', 'html', true);
    expect(result).toContain('<table>');
  });

  it('converts to markdown format', () => {
    const result = convert('a,b\n1,2', ',', 'markdown', true);
    expect(result).toContain('|');
  });

  it('converts to csv format', () => {
    const result = convert('a,b\n1,2', ',', 'csv', true);
    expect(result).toBe('a,b\n1,2');
  });

  it('returns empty string for empty input', () => {
    expect(convert('', ',', 'html', true)).toBe('');
  });
});
