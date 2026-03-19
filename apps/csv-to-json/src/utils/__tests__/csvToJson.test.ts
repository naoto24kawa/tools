import { describe, it, expect } from 'vitest';
import { parse } from '../csvToJson';

describe('csvToJson', () => {
  it('parses CSV with headers', () => {
    const csv = 'name,age,city\nAlice,30,Tokyo\nBob,25,Osaka';
    const result = JSON.parse(parse(csv, { hasHeader: true, delimiter: ',', quoteChar: '"', prettyPrint: false }));
    expect(result).toEqual([
      { name: 'Alice', age: '30', city: 'Tokyo' },
      { name: 'Bob', age: '25', city: 'Osaka' },
    ]);
  });

  it('parses CSV without headers as array of arrays', () => {
    const csv = 'Alice,30,Tokyo\nBob,25,Osaka';
    const result = JSON.parse(parse(csv, { hasHeader: false, delimiter: ',', quoteChar: '"', prettyPrint: false }));
    expect(result).toEqual([
      ['Alice', '30', 'Tokyo'],
      ['Bob', '25', 'Osaka'],
    ]);
  });

  it('handles tab delimiter', () => {
    const csv = 'name\tage\nAlice\t30';
    const result = JSON.parse(parse(csv, { hasHeader: true, delimiter: '\t', quoteChar: '"', prettyPrint: false }));
    expect(result).toEqual([{ name: 'Alice', age: '30' }]);
  });

  it('handles semicolon delimiter', () => {
    const csv = 'name;age\nAlice;30';
    const result = JSON.parse(parse(csv, { hasHeader: true, delimiter: ';', quoteChar: '"', prettyPrint: false }));
    expect(result).toEqual([{ name: 'Alice', age: '30' }]);
  });

  it('handles pipe delimiter', () => {
    const csv = 'name|age\nAlice|30';
    const result = JSON.parse(parse(csv, { hasHeader: true, delimiter: '|', quoteChar: '"', prettyPrint: false }));
    expect(result).toEqual([{ name: 'Alice', age: '30' }]);
  });

  it('handles quoted fields with commas', () => {
    const csv = 'name,address\nAlice,"Tokyo, Japan"';
    const result = JSON.parse(parse(csv, { hasHeader: true, delimiter: ',', quoteChar: '"', prettyPrint: false }));
    expect(result).toEqual([{ name: 'Alice', address: 'Tokyo, Japan' }]);
  });

  it('handles escaped quotes', () => {
    const csv = 'name,value\nAlice,"He said ""hello"""';
    const result = JSON.parse(parse(csv, { hasHeader: true, delimiter: ',', quoteChar: '"', prettyPrint: false }));
    expect(result).toEqual([{ name: 'Alice', value: 'He said "hello"' }]);
  });

  it('produces pretty-printed JSON', () => {
    const csv = 'name\nAlice';
    const result = parse(csv, { hasHeader: true, delimiter: ',', quoteChar: '"', prettyPrint: true });
    expect(result).toContain('\n');
    expect(result).toContain('  ');
  });

  it('throws on empty input', () => {
    expect(() => parse('', { hasHeader: true, delimiter: ',', quoteChar: '"', prettyPrint: false })).toThrow('Input is empty');
  });

  it('returns empty array when header-only CSV', () => {
    const csv = 'name,age';
    const result = JSON.parse(parse(csv, { hasHeader: true, delimiter: ',', quoteChar: '"', prettyPrint: false }));
    expect(result).toEqual([]);
  });

  it('handles CRLF line endings', () => {
    const csv = 'name,age\r\nAlice,30\r\nBob,25';
    const result = JSON.parse(parse(csv, { hasHeader: true, delimiter: ',', quoteChar: '"', prettyPrint: false }));
    expect(result).toHaveLength(2);
  });
});
