import { describe, expect, test } from 'vitest';
import { compareLists } from '../listCompare';

describe('compareLists', () => {
  test('finds common items', () => {
    const result = compareLists('a\nb\nc', 'b\nc\nd', true);
    expect(result.common).toEqual(['b', 'c']);
  });

  test('finds only in A', () => {
    const result = compareLists('a\nb\nc', 'b\nc\nd', true);
    expect(result.onlyInA).toEqual(['a']);
  });

  test('finds only in B', () => {
    const result = compareLists('a\nb\nc', 'b\nc\nd', true);
    expect(result.onlyInB).toEqual(['d']);
  });

  test('union contains all unique', () => {
    const result = compareLists('a\nb', 'b\nc', true);
    expect(result.union.sort()).toEqual(['a', 'b', 'c']);
  });

  test('case insensitive', () => {
    const result = compareLists('Apple\nBanana', 'apple\ncherry', false);
    expect(result.common.length).toBe(1);
    expect(result.onlyInB.length).toBe(1);
  });

  test('empty lists', () => {
    const result = compareLists('', '', true);
    expect(result.common).toEqual([]);
    expect(result.onlyInA).toEqual([]);
    expect(result.onlyInB).toEqual([]);
    expect(result.union).toEqual([]);
  });

  test('identical lists', () => {
    const result = compareLists('a\nb', 'a\nb', true);
    expect(result.common).toEqual(['a', 'b']);
    expect(result.onlyInA).toEqual([]);
    expect(result.onlyInB).toEqual([]);
  });

  test('completely different lists', () => {
    const result = compareLists('a\nb', 'c\nd', true);
    expect(result.common).toEqual([]);
    expect(result.onlyInA).toEqual(['a', 'b']);
    expect(result.onlyInB).toEqual(['c', 'd']);
  });

  test('skips empty lines', () => {
    const result = compareLists('a\n\nb', 'b\n\nc', true);
    expect(result.common).toEqual(['b']);
  });
});
