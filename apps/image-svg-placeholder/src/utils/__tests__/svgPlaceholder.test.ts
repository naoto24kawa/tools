import { describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG, generateSVG, svgToDataUri } from '../svgPlaceholder';

describe('svgPlaceholder', () => {
  test('generates SVG with dimensions', () => {
    const svg = generateSVG(DEFAULT_CONFIG);
    expect(svg).toContain('width="300"');
    expect(svg).toContain('height="200"');
  });

  test('shows dimensions as text by default', () => {
    const svg = generateSVG(DEFAULT_CONFIG);
    expect(svg).toContain('300 x 200');
  });

  test('custom text', () => {
    const svg = generateSVG({ ...DEFAULT_CONFIG, text: 'Hello' });
    expect(svg).toContain('Hello');
    expect(svg).not.toContain('300 x 200');
  });

  test('custom colors', () => {
    const svg = generateSVG({ ...DEFAULT_CONFIG, bgColor: '#ff0000', textColor: '#00ff00' });
    expect(svg).toContain('#ff0000');
    expect(svg).toContain('#00ff00');
  });

  test('svgToDataUri starts with data:', () => {
    const uri = svgToDataUri(generateSVG(DEFAULT_CONFIG));
    expect(uri).toStartWith('data:image/svg+xml,');
  });

  test('includes xmlns', () => {
    expect(generateSVG(DEFAULT_CONFIG)).toContain('xmlns=');
  });
});
