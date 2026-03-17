import { describe, expect, test } from 'bun:test';
import { getCSSFilter } from '../imageBrightness';

describe('imageBrightness', () => {
  test('getCSSFilter default', () => {
    expect(getCSSFilter(100, 100, 100)).toBe(
      'filter: brightness(100%) contrast(100%) saturate(100%);'
    );
  });

  test('getCSSFilter custom', () => {
    expect(getCSSFilter(150, 80, 120)).toContain('brightness(150%)');
  });
});
