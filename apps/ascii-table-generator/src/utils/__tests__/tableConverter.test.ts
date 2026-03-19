import { describe, test, expect } from 'vitest';
import {
  parseMarkdownTable,
  markdownToAscii,
  asciiToMarkdown,
  generateTable,
  tableDataToAscii,
} from '../tableConverter';

describe('parseMarkdownTable', () => {
  test('should parse a simple markdown table', () => {
    const md = `
| Name | Age |
| --- | --- |
| Alice | 30 |
| Bob | 25 |
    `;
    const result = parseMarkdownTable(md);
    expect(result).not.toBeNull();
    expect(result!.headers).toEqual(['Name', 'Age']);
    expect(result!.rows).toEqual([
      ['Alice', '30'],
      ['Bob', '25'],
    ]);
  });

  test('should parse alignments', () => {
    const md = `
| Left | Center | Right |
| :--- | :---: | ---: |
| a | b | c |
    `;
    const result = parseMarkdownTable(md);
    expect(result).not.toBeNull();
    expect(result!.alignments).toEqual(['left', 'center', 'right']);
  });

  test('should return null for invalid input', () => {
    expect(parseMarkdownTable('not a table')).toBeNull();
    expect(parseMarkdownTable('')).toBeNull();
  });

  test('should handle tables without leading/trailing pipes', () => {
    const md = `
Name | Age
--- | ---
Alice | 30
    `;
    const result = parseMarkdownTable(md);
    expect(result).not.toBeNull();
    expect(result!.headers).toEqual(['Name', 'Age']);
  });
});

describe('markdownToAscii', () => {
  test('should convert markdown to ascii table', () => {
    const md = `
| Name | Age |
| --- | --- |
| Alice | 30 |
| Bob | 25 |
    `;
    const result = markdownToAscii(md);
    expect(result).toContain('+');
    expect(result).toContain('|');
    expect(result).toContain('Alice');
    expect(result).toContain('Bob');

    const lines = result.split('\n');
    expect(lines[0]).toMatch(/^\+[-+]+\+$/);
    expect(lines.length).toBe(6);
  });

  test('should return empty string for invalid input', () => {
    expect(markdownToAscii('not a table')).toBe('');
  });
});

describe('asciiToMarkdown', () => {
  test('should convert ascii table to markdown', () => {
    const ascii = `
+-------+-----+
| Name  | Age |
+-------+-----+
| Alice | 30  |
| Bob   | 25  |
+-------+-----+
    `;
    const result = asciiToMarkdown(ascii);
    expect(result).toContain('|');
    expect(result).toContain('Name');
    expect(result).toContain('---');
    expect(result).toContain('Alice');
  });

  test('should return empty string for invalid input', () => {
    expect(asciiToMarkdown('+++')).toBe('');
  });
});

describe('generateTable', () => {
  test('should generate default table data', () => {
    const result = generateTable(2, 3);
    expect(result.headers).toEqual(['Header 1', 'Header 2', 'Header 3']);
    expect(result.rows.length).toBe(2);
    expect(result.rows[0].length).toBe(3);
    expect(result.alignments.length).toBe(3);
  });

  test('should use provided header data', () => {
    const result = generateTable(1, 2, undefined, ['Name', 'Age']);
    expect(result.headers).toEqual(['Name', 'Age']);
  });

  test('should use provided cell data', () => {
    const data = [
      ['Alice', '30'],
      ['Bob', '25'],
    ];
    const result = generateTable(2, 2, data, ['Name', 'Age']);
    expect(result.rows).toEqual(data);
  });

  test('should use provided alignments', () => {
    const result = generateTable(1, 3, undefined, undefined, ['left', 'center', 'right']);
    expect(result.alignments).toEqual(['left', 'center', 'right']);
  });
});

describe('tableDataToAscii', () => {
  test('should generate proper ascii borders', () => {
    const table = generateTable(1, 2, [['a', 'b']], ['X', 'Y']);
    const result = tableDataToAscii(table);
    const lines = result.split('\n');
    expect(lines[0]).toMatch(/^\+[-+]+\+$/);
    expect(lines[2]).toMatch(/^\+[-+]+\+$/);
    expect(lines[lines.length - 1]).toMatch(/^\+[-+]+\+$/);
  });

  test('should right-align cells', () => {
    const table = generateTable(1, 1, [['hi']], ['Test'], ['right']);
    const result = tableDataToAscii(table);
    expect(result).toContain('Test');
    expect(result).toContain('hi');
  });

  test('should center-align cells', () => {
    const table = generateTable(1, 1, [['hi']], ['Test'], ['center']);
    const result = tableDataToAscii(table);
    expect(result).toContain('Test');
  });
});

describe('round-trip', () => {
  test('should preserve data through markdown -> ascii -> markdown', () => {
    const md = `| Name | Age |
| --- | --- |
| Alice | 30 |
| Bob | 25 |`;
    const ascii = markdownToAscii(md);
    const backToMd = asciiToMarkdown(ascii);
    expect(backToMd).toContain('Name');
    expect(backToMd).toContain('Alice');
    expect(backToMd).toContain('30');
  });
});
