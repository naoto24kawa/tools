import { describe, expect, test } from 'bun:test';
import { DEFAULT_OPTIONS, formatFileSize, formatTime } from '../videoToGif';

describe('videoToGif', () => {
  test('default options are valid', () => {
    expect(DEFAULT_OPTIONS.fps).toBeGreaterThan(0);
    expect(DEFAULT_OPTIONS.width).toBeGreaterThan(0);
    expect(DEFAULT_OPTIONS.quality).toBeGreaterThan(0);
    expect(DEFAULT_OPTIONS.quality).toBeLessThanOrEqual(1);
    expect(DEFAULT_OPTIONS.startTime).toBe(0);
    expect(DEFAULT_OPTIONS.duration).toBeGreaterThan(0);
  });

  test('formatFileSize formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(0)).toBe('0 B');
  });

  test('formatFileSize formats kilobytes', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(1024)).toBe('1.0 KB');
  });

  test('formatFileSize formats megabytes', () => {
    expect(formatFileSize(2 * 1024 * 1024)).toBe('2.0 MB');
    expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
  });

  test('formatTime formats seconds', () => {
    expect(formatTime(0)).toBe('0:00.0');
    expect(formatTime(5)).toBe('0:05.0');
    expect(formatTime(65)).toBe('1:05.0');
    expect(formatTime(3.5)).toBe('0:03.5');
  });
});
