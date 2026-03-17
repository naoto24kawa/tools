import { describe, expect, test } from 'bun:test';
import { DEFAULT_CONFIG, generateCSS } from '../glassmorphism';

describe('glassmorphism', () => {
  test('generates backdrop-filter', () => {
    const css = generateCSS(DEFAULT_CONFIG);
    expect(css).toContain('backdrop-filter');
    expect(css).toContain('blur(16px)');
  });

  test('generates webkit prefix', () => {
    const css = generateCSS(DEFAULT_CONFIG);
    expect(css).toContain('-webkit-backdrop-filter');
  });

  test('generates border-radius', () => {
    const css = generateCSS(DEFAULT_CONFIG);
    expect(css).toContain('border-radius: 16px');
  });

  test('generates border when enabled', () => {
    const css = generateCSS(DEFAULT_CONFIG);
    expect(css).toContain('border:');
  });

  test('no border when disabled', () => {
    const css = generateCSS({ ...DEFAULT_CONFIG, border: false });
    expect(css).not.toContain('border:');
  });

  test('includes background with rgba', () => {
    const css = generateCSS(DEFAULT_CONFIG);
    expect(css).toContain('background: rgba');
  });
});
