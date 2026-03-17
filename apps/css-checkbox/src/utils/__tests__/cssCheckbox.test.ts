import { describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG, generateCSS } from '../cssCheckbox';

describe('cssCheckbox', () => {
  test('switch contains slider', () => {
    expect(generateCSS(DEFAULT_CONFIG)).toContain('.slider');
  });
  test('checkbox type', () => {
    expect(generateCSS({ ...DEFAULT_CONFIG, type: 'checkbox' })).toContain('.checkbox');
  });
  test('uses custom color', () => {
    expect(generateCSS({ ...DEFAULT_CONFIG, activeColor: '#ff0000' })).toContain('#ff0000');
  });
  test('uses custom size', () => {
    expect(generateCSS({ ...DEFAULT_CONFIG, width: 60 })).toContain('60px');
  });
});
