import { describe, expect, test } from 'bun:test';
import { buildFilter, DEFAULT_FILTERS } from '../imageFilter';

describe('imageFilter', () => {
  test('default returns none', () => {
    expect(buildFilter(DEFAULT_FILTERS)).toBe('none');
  });
  test('brightness change', () => {
    expect(buildFilter({ ...DEFAULT_FILTERS, brightness: 150 })).toContain('brightness(150%)');
  });
  test('multiple filters', () => {
    const f = buildFilter({ ...DEFAULT_FILTERS, brightness: 120, grayscale: 50 });
    expect(f).toContain('brightness');
    expect(f).toContain('grayscale');
  });
  test('blur uses px', () => {
    expect(buildFilter({ ...DEFAULT_FILTERS, blur: 5 })).toContain('blur(5px)');
  });
  test('hueRotate uses deg', () => {
    expect(buildFilter({ ...DEFAULT_FILTERS, hueRotate: 90 })).toContain('hue-rotate(90deg)');
  });
});
