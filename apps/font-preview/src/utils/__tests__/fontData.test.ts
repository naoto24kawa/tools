import { describe, it, expect } from 'vitest';
import {
  SYSTEM_FONTS,
  GOOGLE_FONTS,
  ALL_FONTS,
  FONT_WEIGHTS,
  getGoogleFontUrl,
  getGoogleFontImportCss,
  getGoogleFontLinkTag,
  getFontFamilyCss,
} from '../fontData';

describe('fontData', () => {
  describe('font lists', () => {
    it('should have system fonts', () => {
      expect(SYSTEM_FONTS.length).toBeGreaterThan(0);
      expect(SYSTEM_FONTS.every((f) => f.category === 'system')).toBe(true);
    });

    it('should have Google fonts', () => {
      expect(GOOGLE_FONTS.length).toBeGreaterThan(0);
      expect(GOOGLE_FONTS.every((f) => f.category === 'google')).toBe(true);
    });

    it('should combine all fonts', () => {
      expect(ALL_FONTS.length).toBe(SYSTEM_FONTS.length + GOOGLE_FONTS.length);
    });

    it('should have font weights', () => {
      expect(FONT_WEIGHTS.length).toBe(9);
      expect(FONT_WEIGHTS[0].value).toBe(100);
      expect(FONT_WEIGHTS[8].value).toBe(900);
    });
  });

  describe('getGoogleFontUrl', () => {
    it('should encode font name with spaces', () => {
      const url = getGoogleFontUrl('Open Sans');
      expect(url).toContain('Open+Sans');
      expect(url).toContain('fonts.googleapis.com');
    });

    it('should include weights when provided', () => {
      const url = getGoogleFontUrl('Inter', [400, 700]);
      expect(url).toContain('wght@400;700');
    });

    it('should work without weights', () => {
      const url = getGoogleFontUrl('Inter');
      expect(url).not.toContain('wght');
    });
  });

  describe('getGoogleFontImportCss', () => {
    it('should return valid CSS import', () => {
      const css = getGoogleFontImportCss('Inter');
      expect(css).toMatch(/^@import url\('/);
      expect(css).toContain('fonts.googleapis.com');
      expect(css).toMatch(/'\);$/);
    });
  });

  describe('getGoogleFontLinkTag', () => {
    it('should return valid link tag', () => {
      const tag = getGoogleFontLinkTag('Roboto');
      expect(tag).toMatch(/^<link/);
      expect(tag).toContain('rel="stylesheet"');
      expect(tag).toContain('fonts.googleapis.com');
    });
  });

  describe('getFontFamilyCss', () => {
    it('should quote font names with spaces', () => {
      const css = getFontFamilyCss({ name: 'Open Sans', category: 'google', fallback: 'sans-serif' });
      expect(css).toBe("font-family: 'Open Sans', sans-serif;");
    });

    it('should not quote single-word font names', () => {
      const css = getFontFamilyCss({ name: 'Inter', category: 'google', fallback: 'sans-serif' });
      expect(css).toBe('font-family: Inter, sans-serif;');
    });
  });
});
