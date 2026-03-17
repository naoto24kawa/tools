import { describe, expect, test } from 'vitest';
import { jsonToXml } from '../jsonToXml';

describe('jsonToXml', () => {
  test('simple object', () => {
    const r = jsonToXml('{"name":"Alice","age":30}');
    expect(r.error).toBeNull();
    expect(r.xml).toContain('<name>Alice</name>');
    expect(r.xml).toContain('<age>30</age>');
    expect(r.xml).toContain('<root>');
  });

  test('custom root tag', () => {
    const r = jsonToXml('{"a":1}', 'data');
    expect(r.xml).toContain('<data>');
    expect(r.xml).toContain('</data>');
  });

  test('nested objects', () => {
    const r = jsonToXml('{"person":{"name":"Alice"}}');
    expect(r.xml).toContain('<person>');
    expect(r.xml).toContain('  <name>Alice</name>');
  });

  test('arrays', () => {
    const r = jsonToXml('{"items":[1,2,3]}');
    expect(r.xml).toContain('<items>1</items>');
    expect(r.xml).toContain('<items>2</items>');
  });

  test('null value', () => {
    const r = jsonToXml('{"a":null}');
    expect(r.xml).toContain('<a/>');
  });

  test('escapes XML entities', () => {
    const r = jsonToXml('{"a":"<b>&</b>"}');
    expect(r.xml).toContain('&lt;b&gt;&amp;&lt;/b&gt;');
  });

  test('includes XML declaration', () => {
    const r = jsonToXml('{"a":1}');
    expect(r.xml).toStartWith('<?xml version="1.0"');
  });

  test('invalid JSON', () => {
    expect(jsonToXml('{bad}').error).not.toBeNull();
  });

  test('empty input', () => {
    expect(jsonToXml('').xml).toBe('');
  });
});
