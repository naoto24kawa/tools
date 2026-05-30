import { describe, expect, test } from 'vitest';
import { REGISTRY, TOOL_NAMES } from '../registry.js';

describe('text transform tools', () => {
  test('upper-case', () => {
    expect(REGISTRY['upper-case']('hello world')).toBe('HELLO WORLD');
  });
  test('lower-case', () => {
    expect(REGISTRY['lower-case']('HELLO WORLD')).toBe('hello world');
  });
  test('title-case', () => {
    expect(REGISTRY['title-case']('hello world')).toBe('Hello World');
  });
  test('sentence-case', () => {
    expect(REGISTRY['sentence-case']('hello world')).toBe('Hello world');
  });
  test('camel-case', () => {
    expect(REGISTRY['camel-case']('hello world')).toBe('helloWorld');
  });
  test('pascal-case', () => {
    expect(REGISTRY['pascal-case']('hello world')).toBe('HelloWorld');
  });
  test('snake-case', () => {
    expect(REGISTRY['snake-case']('hello world')).toBe('hello_world');
  });
  test('kebab-case', () => {
    expect(REGISTRY['kebab-case']('hello world')).toBe('hello-world');
  });
  test('reverse-chars', () => {
    expect(REGISTRY['reverse-chars']('hello')).toBe('olleh');
  });
  test('reverse-words', () => {
    expect(REGISTRY['reverse-words']('hello world')).toBe('world hello');
  });
  test('reverse-lines', () => {
    expect(REGISTRY['reverse-lines']('a\nb\nc')).toBe('c\nb\na');
  });
  test('slugify', () => {
    const result = REGISTRY['slugify']('Hello World');
    expect(result).toBe('hello-world');
  });
  test('sort-lines', () => {
    expect(REGISTRY['sort-lines']('b\na\nc')).toBe('a\nb\nc');
  });
  test('to-katakana', () => {
    expect(REGISTRY['to-katakana']('あいう')).toBe('アイウ');
  });
  test('to-hiragana', () => {
    expect(REGISTRY['to-hiragana']('アイウ')).toBe('あいう');
  });
  test('TOOL_NAMES includes text tools', () => {
    expect(TOOL_NAMES).toContain('upper-case');
    expect(TOOL_NAMES).toContain('kebab-case');
  });
});

describe('encode tools', () => {
  test('base64-encode', () => {
    expect(REGISTRY['base64-encode']('hello')).toBe('aGVsbG8=');
  });
  test('base64-decode', () => {
    expect(REGISTRY['base64-decode']('aGVsbG8=')).toBe('hello');
  });
  test('html-entity-encode', () => {
    expect(REGISTRY['html-entity-encode']('<div>')).toContain('&lt;');
  });
  test('html-entity-decode', () => {
    expect(REGISTRY['html-entity-decode']('&lt;div&gt;')).toBe('<div>');
  });
  test('uuencode roundtrip', () => {
    const encoded = REGISTRY['uuencode']('hello');
    expect(encoded).toContain('begin');
    expect(REGISTRY['uudecode'](encoded)).toContain('hello');
  });
});

describe('format tools', () => {
  test('json-format', () => {
    const result = REGISTRY['json-format']('{"a":1}');
    expect(result).toContain('"a": 1');
  });
  test('json-minify', () => {
    const result = REGISTRY['json-minify']('{\n  "a": 1\n}');
    expect(result).toBe('{"a":1}');
  });
  test('xml-format', () => {
    const result = REGISTRY['xml-format']('<root><child/></root>');
    expect(result).toContain('child');
  });
  test('html-format', () => {
    const result = REGISTRY['html-format']('<div><p>hello</p></div>');
    expect(result).toContain('<p>');
  });
  test('html-minify', () => {
    const result = REGISTRY['html-minify']('<div>\n  <p>hello</p>\n</div>');
    expect(result.length).toBeLessThan(30);
  });
  test('yaml-to-json', () => {
    const result = REGISTRY['yaml-to-json']('key: value');
    expect(JSON.parse(result)).toEqual({ key: 'value' });
  });
  test('json-to-yaml', () => {
    const result = REGISTRY['json-to-yaml']('{"key":"value"}');
    expect(result).toContain('key:');
  });
  test('xml-to-json', () => {
    const result = REGISTRY['xml-to-json']('<root><item>1</item></root>');
    expect(result).toContain('"item"');
  });
  test('toml-to-json', () => {
    const result = REGISTRY['toml-to-json']('[section]\nkey = "value"');
    const obj = JSON.parse(result);
    expect(obj.section.key).toBe('value');
  });
});

describe('crypto tools', () => {
  test('atbash', () => {
    expect(REGISTRY['atbash']('abc')).toBe('zyx');
  });
  test('caesar-encrypt plain string (shift=3)', () => {
    expect(REGISTRY['caesar-encrypt']('abc')).toBe('def');
  });
  test('caesar-encrypt JSON input', () => {
    expect(REGISTRY['caesar-encrypt']('{"text":"abc","shift":1}')).toBe('bcd');
  });
});

describe('generate tools', () => {
  test('uuid-v4 returns UUID format', () => {
    const result = REGISTRY['uuid-v4']('');
    expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
  test('ulid returns 26 chars', () => {
    expect(REGISTRY['ulid']('').length).toBe(26);
  });
});
