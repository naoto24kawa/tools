import { describe, expect, test } from 'vitest';
import { CLIP_PRESETS, generateCSS } from '../clipPath';

describe('clipPath', () => {
  test('generateCSS includes clip-path', () => {
    expect(generateCSS('circle(50%)')).toContain('clip-path: circle(50%)');
  });

  test('generateCSS includes webkit prefix', () => {
    expect(generateCSS('circle(50%)')).toContain('-webkit-clip-path');
  });

  test('presets has entries', () => {
    expect(CLIP_PRESETS.length).toBeGreaterThan(5);
  });

  test('all presets have name and value', () => {
    for (const p of CLIP_PRESETS) {
      expect(p.name).toBeDefined();
      expect(p.value).toBeDefined();
    }
  });
});
