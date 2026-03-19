import { describe, it, expect } from 'vitest';
import { convert } from '../xmlToJson';

describe('xmlToJson', () => {
  it('converts simple XML element', () => {
    const xml = '<root><name>Alice</name></root>';
    const result = JSON.parse(convert(xml));
    expect(result).toEqual({ root: { name: 'Alice' } });
  });

  it('converts nested XML', () => {
    const xml = '<root><user><name>Alice</name><age>30</age></user></root>';
    const result = JSON.parse(convert(xml));
    expect(result.root.user.name).toBe('Alice');
    expect(result.root.user.age).toBe('30');
  });

  it('includes attributes with @ prefix', () => {
    const xml = '<root><item id="1">Hello</item></root>';
    const result = JSON.parse(convert(xml, {
      includeAttributes: true,
      attributePrefix: '@',
      textContentKey: '#text',
      prettyPrint: false,
    }));
    expect(result.root.item['@id']).toBe('1');
    expect(result.root.item['#text']).toBe('Hello');
  });

  it('excludes attributes when option is false', () => {
    const xml = '<root><item id="1">Hello</item></root>';
    const result = JSON.parse(convert(xml, {
      includeAttributes: false,
      attributePrefix: '@',
      textContentKey: '#text',
      prettyPrint: false,
    }));
    expect(result.root.item).toBe('Hello');
  });

  it('handles repeated elements as arrays', () => {
    const xml = '<root><item>A</item><item>B</item><item>C</item></root>';
    const result = JSON.parse(convert(xml));
    expect(result.root.item).toEqual(['A', 'B', 'C']);
  });

  it('handles empty elements', () => {
    const xml = '<root><empty/></root>';
    const result = JSON.parse(convert(xml));
    expect(result.root.empty).toBeNull();
  });

  it('uses custom attribute prefix', () => {
    const xml = '<root><item id="1">Hello</item></root>';
    const result = JSON.parse(convert(xml, {
      includeAttributes: true,
      attributePrefix: '$',
      textContentKey: '_text',
      prettyPrint: false,
    }));
    expect(result.root.item['$id']).toBe('1');
    expect(result.root.item['_text']).toBe('Hello');
  });

  it('produces pretty-printed output', () => {
    const xml = '<root><name>Alice</name></root>';
    const result = convert(xml, {
      includeAttributes: true,
      attributePrefix: '@',
      textContentKey: '#text',
      prettyPrint: true,
    });
    expect(result).toContain('\n');
    expect(result).toContain('  ');
  });

  it('throws on empty input', () => {
    expect(() => convert('')).toThrow('Input is empty');
  });

  it('throws on invalid XML', () => {
    expect(() => convert('<root><unclosed>')).toThrow('Invalid XML');
  });
});
