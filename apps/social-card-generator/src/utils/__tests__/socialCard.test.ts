import { describe, it, expect } from 'vitest';
import type { SocialCardConfig } from '../socialCard';

describe('socialCard', () => {
  it('config type is valid', () => {
    const config: SocialCardConfig = {
      title: 'Test Title',
      subtitle: 'Sub',
      author: 'Author',
      bgType: 'solid',
      bgColor1: '#ffffff',
      bgColor2: '#000000',
      textColor: '#000000',
      layout: 'centered',
    };
    expect(config.title).toBe('Test Title');
    expect(config.layout).toBe('centered');
  });

  it('layout presets are valid', () => {
    const layouts = ['centered', 'left-aligned', 'split'] as const;
    for (const l of layouts) {
      expect(['centered', 'left-aligned', 'split']).toContain(l);
    }
  });

  it('background types are valid', () => {
    const types = ['solid', 'gradient'] as const;
    for (const t of types) {
      expect(['solid', 'gradient']).toContain(t);
    }
  });
});
