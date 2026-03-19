import { describe, it, expect } from 'vitest';
import { generateCSS, generateSVG, type PatternConfig } from '../patternGenerator';

const baseConfig: PatternConfig = {
  type: 'stripes',
  size: 20,
  color1: '#ffffff',
  color2: '#000000',
  angle: 45,
};

describe('patternGenerator', () => {
  describe('generateCSS', () => {
    it('should generate CSS for stripes', () => {
      const css = generateCSS({ ...baseConfig, type: 'stripes' });
      expect(css).toContain('repeating-linear-gradient');
      expect(css).toContain('#ffffff');
      expect(css).toContain('#000000');
    });

    it('should generate CSS for dots', () => {
      const css = generateCSS({ ...baseConfig, type: 'dots' });
      expect(css).toContain('radial-gradient');
    });

    it('should generate CSS for checkers', () => {
      const css = generateCSS({ ...baseConfig, type: 'checkers' });
      expect(css).toContain('linear-gradient(45deg');
    });

    it('should generate CSS for all types', () => {
      const types = ['stripes', 'dots', 'checkers', 'diagonal', 'zigzag', 'waves'] as const;
      for (const type of types) {
        const css = generateCSS({ ...baseConfig, type });
        expect(css.length).toBeGreaterThan(0);
      }
    });
  });

  describe('generateSVG', () => {
    it('should generate valid SVG for each type', () => {
      const types = ['stripes', 'dots', 'checkers', 'diagonal', 'zigzag', 'waves'] as const;
      for (const type of types) {
        const svg = generateSVG({ ...baseConfig, type });
        expect(svg).toContain('<svg');
        expect(svg).toContain('</svg>');
      }
    });

    it('should include colors in SVG', () => {
      const svg = generateSVG(baseConfig);
      expect(svg).toContain('#ffffff');
      expect(svg).toContain('#000000');
    });
  });
});
