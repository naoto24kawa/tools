import { describe, test, expect } from 'bun:test';
import {
  estimateSizeFromFileSize,
  kbToBytes,
  mbToBytes,
  bytesToKb,
  bytesToMb,
} from '../fileSizeCalculator';

describe('fileSizeCalculator', () => {
  describe('estimateSizeFromFileSize', () => {
    test('should estimate size for PNG format', () => {
      const result = estimateSizeFromFileSize(1024 * 1024, 1000, 1000, 'png');
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
      expect(result.width).toBeLessThanOrEqual(1000);
      expect(result.height).toBeLessThanOrEqual(1000);
    });

    test('should estimate size for JPEG format', () => {
      const result = estimateSizeFromFileSize(1024 * 1024, 1000, 1000, 'jpeg');
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
    });

    test('should estimate size for WebP format', () => {
      const result = estimateSizeFromFileSize(1024 * 1024, 1000, 1000, 'webp');
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
    });

    test('should not exceed original dimensions', () => {
      const result = estimateSizeFromFileSize(10 * 1024 * 1024, 100, 100, 'png');
      expect(result.width).toBeLessThanOrEqual(100);
      expect(result.height).toBeLessThanOrEqual(100);
    });

    test('should maintain aspect ratio', () => {
      const result = estimateSizeFromFileSize(1024 * 1024, 1000, 500, 'png');
      const aspectRatio = result.width / result.height;
      expect(aspectRatio).toBeCloseTo(2, 1);
    });
  });

  describe('kbToBytes', () => {
    test('should convert KB to bytes', () => {
      expect(kbToBytes(1)).toBe(1024);
      expect(kbToBytes(10)).toBe(10240);
      expect(kbToBytes(0)).toBe(0);
    });
  });

  describe('mbToBytes', () => {
    test('should convert MB to bytes', () => {
      expect(mbToBytes(1)).toBe(1048576);
      expect(mbToBytes(10)).toBe(10485760);
      expect(mbToBytes(0)).toBe(0);
    });
  });

  describe('bytesToKb', () => {
    test('should convert bytes to KB', () => {
      expect(bytesToKb(1024)).toBe(1);
      expect(bytesToKb(10240)).toBe(10);
      expect(bytesToKb(0)).toBe(0);
    });
  });

  describe('bytesToMb', () => {
    test('should convert bytes to MB', () => {
      expect(bytesToMb(1048576)).toBe(1);
      expect(bytesToMb(10485760)).toBe(10);
      expect(bytesToMb(0)).toBe(0);
    });
  });
});
