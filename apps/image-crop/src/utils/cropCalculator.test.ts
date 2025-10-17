import { describe, test, expect } from 'bun:test';
import {
  percentToPixels,
  pixelsToPercent,
  calculateCropPixels,
  formatFileSize,
  calculateAspectRatio,
} from './cropCalculator';

describe('cropCalculator', () => {
  describe('percentToPixels', () => {
    test('converts 50% to 500px when dimension is 1000', () => {
      const result = percentToPixels(50, 1000);
      expect(result).toBe(500);
    });

    test('converts 25% to 250px when dimension is 1000', () => {
      const result = percentToPixels(25, 1000);
      expect(result).toBe(250);
    });

    test('converts 100% to 1920px when dimension is 1920', () => {
      const result = percentToPixels(100, 1920);
      expect(result).toBe(1920);
    });
  });

  describe('pixelsToPercent', () => {
    test('converts 500px to 50% when dimension is 1000', () => {
      const result = pixelsToPercent(500, 1000);
      expect(result).toBe(50);
    });

    test('converts 250px to 25% when dimension is 1000', () => {
      const result = pixelsToPercent(250, 1000);
      expect(result).toBe(25);
    });
  });

  describe('calculateCropPixels', () => {
    test('returns same values when unit is px', () => {
      const crop = { unit: 'px' as const, x: 100, y: 100, width: 500, height: 400 };
      const imageSize = { width: 1000, height: 800 };

      const result = calculateCropPixels(crop, imageSize);

      expect(result).toEqual(crop);
    });

    test('converts percentage crop to pixels', () => {
      const crop = { unit: '%' as const, x: 25, y: 25, width: 50, height: 50 };
      const imageSize = { width: 1000, height: 800 };

      const result = calculateCropPixels(crop, imageSize);

      expect(result).toEqual({
        x: 250,
        y: 200,
        width: 500,
        height: 400,
        unit: 'px',
      });
    });
  });

  describe('formatFileSize', () => {
    test('formats bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });

    test('formats kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1.00 KB');
      expect(formatFileSize(2048)).toBe('2.00 KB');
    });

    test('formats megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1.00 MB');
      expect(formatFileSize(5 * 1024 * 1024)).toBe('5.00 MB');
    });
  });

  describe('calculateAspectRatio', () => {
    test('calculates 16:9 aspect ratio', () => {
      const result = calculateAspectRatio(1920, 1080);
      expect(result).toBe('16:9');
    });

    test('calculates 4:3 aspect ratio', () => {
      const result = calculateAspectRatio(800, 600);
      expect(result).toBe('4:3');
    });

    test('calculates 1:1 aspect ratio', () => {
      const result = calculateAspectRatio(500, 500);
      expect(result).toBe('1:1');
    });

    test('calculates 3:2 aspect ratio', () => {
      const result = calculateAspectRatio(1500, 1000);
      expect(result).toBe('3:2');
    });
  });
});
