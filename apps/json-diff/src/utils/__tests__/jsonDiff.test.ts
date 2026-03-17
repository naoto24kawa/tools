import { describe, expect, test } from 'vitest';
import { compareJSON } from '../jsonDiff';

describe('compareJSON', () => {
  test('identical JSON has no diffs', () => {
    expect(compareJSON('{"a":1}', '{"a":1}').diffs).toEqual([]);
  });

  test('detects added key', () => {
    const r = compareJSON('{"a":1}', '{"a":1,"b":2}');
    expect(r.diffs.length).toBe(1);
    expect(r.diffs[0].type).toBe('added');
    expect(r.diffs[0].path).toBe('b');
  });

  test('detects removed key', () => {
    const r = compareJSON('{"a":1,"b":2}', '{"a":1}');
    expect(r.diffs.length).toBe(1);
    expect(r.diffs[0].type).toBe('removed');
  });

  test('detects changed value', () => {
    const r = compareJSON('{"a":1}', '{"a":2}');
    expect(r.diffs.length).toBe(1);
    expect(r.diffs[0].type).toBe('changed');
    expect(r.diffs[0].oldValue).toBe(1);
    expect(r.diffs[0].newValue).toBe(2);
  });

  test('detects nested changes', () => {
    const r = compareJSON('{"a":{"b":1}}', '{"a":{"b":2}}');
    expect(r.diffs[0].path).toBe('a.b');
  });

  test('detects array changes', () => {
    const r = compareJSON('[1,2,3]', '[1,2,4]');
    expect(r.diffs[0].path).toBe('[2]');
    expect(r.diffs[0].type).toBe('changed');
  });

  test('detects array additions', () => {
    const r = compareJSON('[1]', '[1,2]');
    expect(r.diffs[0].type).toBe('added');
  });

  test('invalid JSON returns error', () => {
    expect(compareJSON('{bad}', '{}').error).not.toBeNull();
  });

  test('empty inputs', () => {
    expect(compareJSON('', '').diffs).toEqual([]);
  });
});
