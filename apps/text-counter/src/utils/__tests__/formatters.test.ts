import { describe, test, expect } from 'vitest';
import {
  formatNumber,
  formatBytes,
  formatReadingTime,
  formatStatsForClipboard,
} from '../formatters';

describe('formatters', () => {
  describe('formatNumber', () => {
    test('should format number with thousand separators', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    test('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    test('should handle small numbers', () => {
      expect(formatNumber(1)).toBe('1');
      expect(formatNumber(99)).toBe('99');
    });
  });

  describe('formatBytes', () => {
    test('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(100)).toBe('100.00 B');
      expect(formatBytes(1024)).toBe('1.00 KB');
      expect(formatBytes(1048576)).toBe('1.00 MB');
      expect(formatBytes(1073741824)).toBe('1.00 GB');
    });

    test('should handle decimal values', () => {
      expect(formatBytes(1536)).toBe('1.50 KB');
      expect(formatBytes(2621440)).toBe('2.50 MB');
    });
  });

  describe('formatReadingTime', () => {
    test('should format zero minutes', () => {
      expect(formatReadingTime(0)).toBe('0分');
    });

    test('should format less than 1 minute', () => {
      expect(formatReadingTime(0.5)).toBe('1分未満');
    });

    test('should format minutes only', () => {
      expect(formatReadingTime(5)).toBe('約5分');
      expect(formatReadingTime(30)).toBe('約30分');
    });

    test('should format hours only', () => {
      expect(formatReadingTime(60)).toBe('約1時間');
      expect(formatReadingTime(120)).toBe('約2時間');
    });

    test('should format hours and minutes', () => {
      expect(formatReadingTime(65)).toBe('約1時間5分');
      expect(formatReadingTime(125)).toBe('約2時間5分');
    });
  });

  describe('formatStatsForClipboard', () => {
    test('should format stats correctly', () => {
      const stats = {
        charsWithSpaces: 1000,
        charsWithoutSpaces: 800,
        words: 150,
        lines: 20,
        paragraphs: 5,
        bytes: 1024,
        readingTimeMinutes: 5,
      };

      const result = formatStatsForClipboard(stats);

      expect(result).toContain('=== テキスト統計情報 ===');
      expect(result).toContain('文字数（スペース含む）: 1,000');
      expect(result).toContain('文字数（スペース除外）: 800');
      expect(result).toContain('単語数: 150');
      expect(result).toContain('行数: 20');
      expect(result).toContain('段落数: 5');
      expect(result).toContain('バイト数: 1.00 KB');
      expect(result).toContain('読了時間: 約5分');
    });

    test('should handle zero values', () => {
      const stats = {
        charsWithSpaces: 0,
        charsWithoutSpaces: 0,
        words: 0,
        lines: 0,
        paragraphs: 0,
        bytes: 0,
        readingTimeMinutes: 0,
      };

      const result = formatStatsForClipboard(stats);

      expect(result).toContain('文字数（スペース含む）: 0');
      expect(result).toContain('バイト数: 0 B');
      expect(result).toContain('読了時間: 0分');
    });
  });
});
