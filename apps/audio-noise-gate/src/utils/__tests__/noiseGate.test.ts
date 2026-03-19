import { describe, it, expect } from 'vitest';
import {
  getDefaultOptions,
  dbToLinear,
  linearToDb,
  formatDuration,
  formatFileSize,
  clamp,
} from '../noiseGate';

describe('noiseGate', () => {
  describe('getDefaultOptions', () => {
    it('returns default options', () => {
      const opts = getDefaultOptions();
      expect(opts.thresholdDb).toBe(-40);
      expect(opts.attackMs).toBe(5);
      expect(opts.releaseMs).toBe(50);
      expect(opts.highPassFreq).toBe(80);
      expect(opts.lowPassFreq).toBe(16000);
    });
  });

  describe('dbToLinear', () => {
    it('converts 0 dB to 1.0', () => {
      expect(dbToLinear(0)).toBeCloseTo(1.0);
    });

    it('converts -6 dB to approximately 0.5', () => {
      expect(dbToLinear(-6)).toBeCloseTo(0.5012, 3);
    });

    it('converts -20 dB to 0.1', () => {
      expect(dbToLinear(-20)).toBeCloseTo(0.1);
    });

    it('converts -40 dB to 0.01', () => {
      expect(dbToLinear(-40)).toBeCloseTo(0.01);
    });

    it('converts -60 dB to 0.001', () => {
      expect(dbToLinear(-60)).toBeCloseTo(0.001);
    });

    it('converts positive dB', () => {
      expect(dbToLinear(6)).toBeCloseTo(1.9953, 3);
    });
  });

  describe('linearToDb', () => {
    it('converts 1.0 to 0 dB', () => {
      expect(linearToDb(1.0)).toBeCloseTo(0);
    });

    it('converts 0.1 to -20 dB', () => {
      expect(linearToDb(0.1)).toBeCloseTo(-20);
    });

    it('converts 0.01 to -40 dB', () => {
      expect(linearToDb(0.01)).toBeCloseTo(-40);
    });

    it('returns -Infinity for 0', () => {
      expect(linearToDb(0)).toBe(-Infinity);
    });

    it('returns -Infinity for negative values', () => {
      expect(linearToDb(-1)).toBe(-Infinity);
    });
  });

  describe('formatDuration', () => {
    it('formats zero', () => {
      expect(formatDuration(0)).toBe('0:00');
    });

    it('formats seconds', () => {
      expect(formatDuration(45)).toBe('0:45');
    });

    it('formats minutes and seconds', () => {
      expect(formatDuration(125)).toBe('2:05');
    });

    it('pads single-digit seconds', () => {
      expect(formatDuration(63)).toBe('1:03');
    });
  });

  describe('formatFileSize', () => {
    it('formats 0 bytes', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('formats KB', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB');
    });

    it('formats MB', () => {
      expect(formatFileSize(1048576)).toBe('1.0 MB');
    });
  });

  describe('clamp', () => {
    it('returns value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('clamps to min', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('clamps to max', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('handles equal min and max', () => {
      expect(clamp(5, 3, 3)).toBe(3);
    });

    it('handles negative range', () => {
      expect(clamp(-5, -10, -1)).toBe(-5);
    });
  });
});
