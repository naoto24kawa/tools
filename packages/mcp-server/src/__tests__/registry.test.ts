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
