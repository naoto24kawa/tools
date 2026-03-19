import { describe, expect, it } from 'vitest';
import {
  getDisplayText,
  calculateFontSize,
  generateSvg,
  DEFAULT_OPTIONS,
} from '../placeholderGenerator';

describe('placeholderGenerator', () => {
  describe('getDisplayText', () => {
    it('returns custom text when provided', () => {
      const options = { ...DEFAULT_OPTIONS, text: 'Hello' };
      expect(getDisplayText(options)).toBe('Hello');
    });

    it('returns dimensions when no custom text', () => {
      const options = { ...DEFAULT_OPTIONS, text: '' };
      expect(getDisplayText(options)).toBe('640 x 480');
    });

    it('returns dimensions with correct values', () => {
      const options = { ...DEFAULT_OPTIONS, width: 1920, height: 1080, text: '' };
      expect(getDisplayText(options)).toBe('1920 x 1080');
    });
  });

  describe('calculateFontSize', () => {
    it('returns provided fontSize when positive', () => {
      const options = { ...DEFAULT_OPTIONS, fontSize: 32 };
      expect(calculateFontSize(options)).toBe(32);
    });

    it('calculates based on dimensions when fontSize is 0', () => {
      const options = { ...DEFAULT_OPTIONS, fontSize: 0, width: 640, height: 480 };
      const result = calculateFontSize(options);
      expect(result).toBe(60); // min(640, 480) / 8 = 60
    });

    it('returns minimum of 12', () => {
      const options = { ...DEFAULT_OPTIONS, fontSize: 0, width: 32, height: 32 };
      const result = calculateFontSize(options);
      expect(result).toBe(12); // max(12, 32/8) = max(12, 4) = 12
    });
  });

  describe('generateSvg', () => {
    it('generates valid SVG string', () => {
      const svg = generateSvg(DEFAULT_OPTIONS);
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it('includes width and height attributes', () => {
      const svg = generateSvg({ ...DEFAULT_OPTIONS, width: 800, height: 600 });
      expect(svg).toContain('width="800"');
      expect(svg).toContain('height="600"');
    });

    it('includes background color', () => {
      const svg = generateSvg({ ...DEFAULT_OPTIONS, backgroundColor: '#ff0000' });
      expect(svg).toContain('fill="#ff0000"');
    });

    it('includes text color', () => {
      const svg = generateSvg({ ...DEFAULT_OPTIONS, textColor: '#333333' });
      expect(svg).toContain('fill="#333333"');
    });

    it('includes display text', () => {
      const svg = generateSvg({ ...DEFAULT_OPTIONS, text: 'Test' });
      expect(svg).toContain('Test');
    });

    it('includes default dimensions text', () => {
      const svg = generateSvg({ ...DEFAULT_OPTIONS, text: '' });
      expect(svg).toContain('640 x 480');
    });

    it('escapes special characters in text', () => {
      const svg = generateSvg({ ...DEFAULT_OPTIONS, text: '<script>' });
      expect(svg).toContain('&lt;script&gt;');
      expect(svg).not.toContain('<script>');
    });

    it('includes font-size', () => {
      const svg = generateSvg({ ...DEFAULT_OPTIONS, fontSize: 48 });
      expect(svg).toContain('font-size="48"');
    });
  });
});
