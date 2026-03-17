import { describe, expect, test } from 'bun:test';
import { DEFAULT_CONFIG, generateCSS } from '../grid';

describe('grid', () => {
  test('contains display grid', () => {
    expect(generateCSS(DEFAULT_CONFIG)).toContain('display: grid');
  });
  test('contains columns', () => {
    expect(generateCSS(DEFAULT_CONFIG)).toContain('grid-template-columns: 1fr 1fr 1fr');
  });
  test('contains gap', () => {
    expect(generateCSS(DEFAULT_CONFIG)).toContain('gap: 8px');
  });
  test('custom columns', () => {
    expect(generateCSS({ ...DEFAULT_CONFIG, columnSizes: '1fr 2fr' })).toContain('1fr 2fr');
  });
});
