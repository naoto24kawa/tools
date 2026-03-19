import { describe, it, expect } from 'vitest';
import {
  getDefaultConfig,
  getColorForScheme,
  getWaveformColor,
  formatTime,
  VIEW_MODE_OPTIONS,
  COLOR_SCHEME_OPTIONS,
} from '../audioVisualizer';

describe('audioVisualizer', () => {
  describe('getDefaultConfig', () => {
    it('returns default config', () => {
      const config = getDefaultConfig();
      expect(config.viewMode).toBe('both');
      expect(config.colorScheme).toBe('green');
      expect(config.fftSize).toBe(2048);
    });
  });

  describe('getColorForScheme', () => {
    it('returns green color', () => {
      const color = getColorForScheme('green', 0, 100);
      expect(color).toMatch(/^rgb\(/);
    });

    it('returns blue color', () => {
      const color = getColorForScheme('blue', 50, 100);
      expect(color).toMatch(/^rgb\(/);
    });

    it('returns purple color', () => {
      const color = getColorForScheme('purple', 50, 100);
      expect(color).toMatch(/^rgb\(/);
    });

    it('returns rainbow color as hsl', () => {
      const color = getColorForScheme('rainbow', 50, 100);
      expect(color).toMatch(/^hsl\(/);
    });

    it('returns white color', () => {
      const color = getColorForScheme('white', 0, 100);
      expect(color).toMatch(/^rgb\(/);
    });
  });

  describe('getWaveformColor', () => {
    it('returns correct color for green scheme', () => {
      expect(getWaveformColor('green')).toBe('#00ff88');
    });

    it('returns correct color for blue scheme', () => {
      expect(getWaveformColor('blue')).toBe('#4488ff');
    });

    it('returns correct color for purple scheme', () => {
      expect(getWaveformColor('purple')).toBe('#bb66ff');
    });

    it('returns correct color for rainbow scheme', () => {
      expect(getWaveformColor('rainbow')).toBe('#ff6600');
    });

    it('returns correct color for white scheme', () => {
      expect(getWaveformColor('white')).toBe('#eeeeee');
    });
  });

  describe('formatTime', () => {
    it('formats zero seconds', () => {
      expect(formatTime(0)).toBe('0:00');
    });

    it('formats seconds', () => {
      expect(formatTime(30)).toBe('0:30');
    });

    it('formats minutes and seconds', () => {
      expect(formatTime(125)).toBe('2:05');
    });

    it('pads single-digit seconds', () => {
      expect(formatTime(61)).toBe('1:01');
    });
  });

  describe('constants', () => {
    it('has view mode options', () => {
      expect(VIEW_MODE_OPTIONS).toHaveLength(3);
      expect(VIEW_MODE_OPTIONS.map((o) => o.value)).toEqual(['waveform', 'spectrum', 'both']);
    });

    it('has color scheme options', () => {
      expect(COLOR_SCHEME_OPTIONS).toHaveLength(5);
      expect(COLOR_SCHEME_OPTIONS.map((o) => o.value)).toContain('rainbow');
    });
  });
});
