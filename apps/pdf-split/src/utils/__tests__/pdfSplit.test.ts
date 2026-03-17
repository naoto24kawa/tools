import { describe, expect, test } from 'bun:test';
import { parsePageRanges } from '../pdfSplit';

describe('pdfSplit', () => {
  test('parses single page', () => {
    expect(parsePageRanges('3', 10)).toEqual([{ start: 3, end: 3 }]);
  });
  test('parses range', () => {
    expect(parsePageRanges('1-5', 10)).toEqual([{ start: 1, end: 5 }]);
  });
  test('parses multiple ranges', () => {
    expect(parsePageRanges('1-3, 5, 7-9', 10)).toEqual([
      { start: 1, end: 3 },
      { start: 5, end: 5 },
      { start: 7, end: 9 },
    ]);
  });
  test('clamps to max pages', () => {
    expect(parsePageRanges('1-100', 5)).toEqual([{ start: 1, end: 5 }]);
  });
});
