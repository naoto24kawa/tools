import { describe, test, expect } from 'vitest';
import {
  formatTime,
  parseTime,
  clampTime,
  validateTrimRange,
  calculateTrimmedDuration,
  generateOutputFilename,
  getFileExtension,
} from '../audioTrim';

describe('audioTrim', () => {
  describe('formatTime', () => {
    test('should format 0 seconds', () => {
      expect(formatTime(0)).toBe('0:00.00');
    });

    test('should format seconds with decimal', () => {
      expect(formatTime(5.5)).toBe('0:05.50');
    });

    test('should format minutes and seconds', () => {
      expect(formatTime(65.25)).toBe('1:05.25');
    });

    test('should format large values', () => {
      expect(formatTime(125.1)).toBe('2:05.10');
    });
  });

  describe('parseTime', () => {
    test('should parse mm:ss format', () => {
      expect(parseTime('1:30')).toBe(90);
    });

    test('should parse plain seconds', () => {
      expect(parseTime('45.5')).toBe(45.5);
    });

    test('should handle invalid input', () => {
      expect(parseTime('invalid')).toBe(0);
    });

    test('should parse mm:ss.ms format', () => {
      expect(parseTime('2:15.5')).toBe(135.5);
    });
  });

  describe('clampTime', () => {
    test('should return value within range', () => {
      expect(clampTime(5, 0, 10)).toBe(5);
    });

    test('should clamp below minimum', () => {
      expect(clampTime(-1, 0, 10)).toBe(0);
    });

    test('should clamp above maximum', () => {
      expect(clampTime(15, 0, 10)).toBe(10);
    });
  });

  describe('validateTrimRange', () => {
    test('should validate correct range', () => {
      expect(validateTrimRange(1, 5, 10)).toEqual({ valid: true });
    });

    test('should reject negative start', () => {
      const result = validateTrimRange(-1, 5, 10);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should reject end exceeding duration', () => {
      const result = validateTrimRange(1, 15, 10);
      expect(result.valid).toBe(false);
    });

    test('should reject start >= end', () => {
      const result = validateTrimRange(5, 5, 10);
      expect(result.valid).toBe(false);
    });

    test('should reject very short segments', () => {
      const result = validateTrimRange(5, 5.005, 10);
      expect(result.valid).toBe(false);
    });

    test('should accept start at 0', () => {
      expect(validateTrimRange(0, 5, 10)).toEqual({ valid: true });
    });

    test('should accept end at duration', () => {
      expect(validateTrimRange(0, 10, 10)).toEqual({ valid: true });
    });
  });

  describe('calculateTrimmedDuration', () => {
    test('should calculate correct duration', () => {
      expect(calculateTrimmedDuration(2, 8)).toBe(6);
    });

    test('should handle zero duration', () => {
      expect(calculateTrimmedDuration(5, 5)).toBe(0);
    });

    test('should handle inverted range', () => {
      expect(calculateTrimmedDuration(8, 2)).toBe(0);
    });
  });

  describe('getFileExtension', () => {
    test('should return file extension', () => {
      expect(getFileExtension('audio.mp3')).toBe('mp3');
      expect(getFileExtension('song.wav')).toBe('wav');
    });

    test('should handle no extension', () => {
      expect(getFileExtension('noextension')).toBe('');
    });

    test('should handle multiple dots', () => {
      expect(getFileExtension('my.song.mp3')).toBe('mp3');
    });
  });

  describe('generateOutputFilename', () => {
    test('should add _trimmed suffix', () => {
      expect(generateOutputFilename('song.mp3')).toBe('song_trimmed.wav');
    });

    test('should handle files with multiple dots', () => {
      expect(generateOutputFilename('my.song.wav')).toBe('my.song_trimmed.wav');
    });

    test('should always output as wav', () => {
      const result = generateOutputFilename('audio.ogg');
      expect(result).toContain('.wav');
    });
  });
});
