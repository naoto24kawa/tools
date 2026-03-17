import { describe, expect, test } from 'vitest';
import { DEFAULT_SHADOW, generateCSS, generateFullCSS, layerToCSS } from '../boxShadow';

describe('boxShadow', () => {
  test('layerToCSS basic', () => {
    const css = layerToCSS(DEFAULT_SHADOW);
    expect(css).toContain('4px 4px 10px 0px');
    expect(css).toContain('rgba(0, 0, 0, 0.25)');
  });

  test('inset shadow', () => {
    const css = layerToCSS({ ...DEFAULT_SHADOW, inset: true });
    expect(css).toStartWith('inset ');
  });

  test('generateCSS single layer', () => {
    const css = generateCSS([DEFAULT_SHADOW]);
    expect(css).toContain('4px');
  });

  test('generateCSS multiple layers', () => {
    const css = generateCSS([DEFAULT_SHADOW, DEFAULT_SHADOW]);
    expect(css.split(',').length).toBe(2);
  });

  test('generateCSS empty', () => {
    expect(generateCSS([])).toBe('none');
  });

  test('generateFullCSS', () => {
    const css = generateFullCSS([DEFAULT_SHADOW]);
    expect(css).toStartWith('box-shadow:');
    expect(css).toEndWith(';');
  });

  test('custom opacity', () => {
    const css = layerToCSS({ ...DEFAULT_SHADOW, opacity: 50 });
    expect(css).toContain('0.5)');
  });

  test('custom color', () => {
    const css = layerToCSS({ ...DEFAULT_SHADOW, color: '#ff0000' });
    expect(css).toContain('rgba(255, 0, 0');
  });
});
