import { describe, expect, test } from 'bun:test';
import { DEFAULT_CONFIG, generateCSS, generateFullCSS } from '../gradient';

describe('gradient', () => {
  test('linear gradient', () => {
    const css = generateCSS(DEFAULT_CONFIG);
    expect(css).toContain('linear-gradient');
    expect(css).toContain('135deg');
  });

  test('radial gradient', () => {
    const css = generateCSS({ ...DEFAULT_CONFIG, type: 'radial' });
    expect(css).toContain('radial-gradient');
    expect(css).toContain('circle');
  });

  test('conic gradient', () => {
    const css = generateCSS({ ...DEFAULT_CONFIG, type: 'conic' });
    expect(css).toContain('conic-gradient');
  });

  test('includes stop colors and positions', () => {
    const css = generateCSS(DEFAULT_CONFIG);
    expect(css).toContain('#667eea');
    expect(css).toContain('0%');
    expect(css).toContain('100%');
  });

  test('generateFullCSS includes background property', () => {
    const css = generateFullCSS(DEFAULT_CONFIG);
    expect(css).toStartWith('background:');
    expect(css).toEndWith(';');
  });

  test('custom angle', () => {
    const css = generateCSS({ ...DEFAULT_CONFIG, angle: 45 });
    expect(css).toContain('45deg');
  });

  test('three stops', () => {
    const config = {
      ...DEFAULT_CONFIG,
      stops: [
        { color: '#ff0000', position: 0 },
        { color: '#00ff00', position: 50 },
        { color: '#0000ff', position: 100 },
      ],
    };
    const css = generateCSS(config);
    expect(css).toContain('#00ff00 50%');
  });
});
