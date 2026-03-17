import { describe, expect, test } from 'bun:test';
import { parseJSON, parseToTree } from '../jsonViewer';

describe('jsonViewer', () => {
  test('parseToTree object', () => {
    const tree = parseToTree('root', { a: 1, b: 'hello' });
    expect(tree.type).toBe('object');
    expect(tree.children.length).toBe(2);
  });

  test('parseToTree array', () => {
    const tree = parseToTree('root', [1, 2, 3]);
    expect(tree.type).toBe('array');
    expect(tree.children.length).toBe(3);
  });

  test('parseToTree primitives', () => {
    expect(parseToTree('k', 'hello').type).toBe('string');
    expect(parseToTree('k', 42).type).toBe('number');
    expect(parseToTree('k', true).type).toBe('boolean');
    expect(parseToTree('k', null).type).toBe('null');
  });

  test('parseJSON valid', () => {
    const r = parseJSON('{"a":1}');
    expect(r.tree).not.toBeNull();
    expect(r.error).toBeNull();
  });

  test('parseJSON invalid', () => {
    expect(parseJSON('{bad}').error).not.toBeNull();
  });

  test('parseJSON empty', () => {
    expect(parseJSON('').tree).toBeNull();
  });
});
