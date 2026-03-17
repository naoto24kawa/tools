import { describe, expect, test } from 'bun:test';
import { DEFAULT_CONFIG, generatePatternSVG } from '../svgPattern';

describe('svgPattern', () => {
  test('dots contains circle', () => {
    expect(generatePatternSVG(DEFAULT_CONFIG)).toContain('<circle');
  });
  test('lines contains line', () => {
    expect(generatePatternSVG({ ...DEFAULT_CONFIG, type: 'lines' })).toContain('<line');
  });
  test('grid contains line', () => {
    expect(generatePatternSVG({ ...DEFAULT_CONFIG, type: 'grid' })).toContain('<line');
  });
  test('diagonal', () => {
    expect(generatePatternSVG({ ...DEFAULT_CONFIG, type: 'diagonal' })).toContain('<line');
  });
  test('zigzag', () => {
    expect(generatePatternSVG({ ...DEFAULT_CONFIG, type: 'zigzag' })).toContain('<polyline');
  });
  test('circles', () => {
    expect(generatePatternSVG({ ...DEFAULT_CONFIG, type: 'circles' })).toContain('<circle');
  });
  test('includes xmlns', () => {
    expect(generatePatternSVG(DEFAULT_CONFIG)).toContain('xmlns=');
  });
  test('uses custom color', () => {
    expect(generatePatternSVG({ ...DEFAULT_CONFIG, color: '#ff0000' })).toContain('#ff0000');
  });
});
