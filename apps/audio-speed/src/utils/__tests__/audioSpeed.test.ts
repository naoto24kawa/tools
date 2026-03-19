import { describe, test, expect } from 'vitest';
import {
  clampSpeed,
  isValidSpeed,
  formatSpeed,
  calculateNewDuration,
  formatTime,
  generateOutputFilename,
  MIN_SPEED,
  MAX_SPEED,
  SPEED_PRESETS,
} from '../audioSpeed';

describe('audioSpeed', () => {
  describe('clampSpeed', () => {
    test('should return value within range', () => {
      expect(clampSpeed(1)).toBe(1);
      expect(clampSpeed(2)).toBe(2);
    });

    test('should clamp below minimum', () => {
      expect(clampSpeed(0.1)).toBe(MIN_SPEED);
      expect(clampSpeed(-1)).toBe(MIN_SPEED);
    });

    test('should clamp above maximum', () => {
      expect(clampSpeed(5)).toBe(MAX_SPEED);
      expect(clampSpeed(10)).toBe(MAX_SPEED);
    });

    test('should handle boundary values', () => {
      expect(clampSpeed(MIN_SPEED)).toBe(MIN_SPEED);
      expect(clampSpeed(MAX_SPEED)).toBe(MAX_SPEED);
    });
  });

  describe('isValidSpeed', () => {
    test('should return true for valid speeds', () => {
      expect(isValidSpeed(1)).toBe(true);
      expect(isValidSpeed(0.25)).toBe(true);
      expect(isValidSpeed(4)).toBe(true);
    });

    test('should return false for invalid speeds', () => {
      expect(isValidSpeed(0.1)).toBe(false);
      expect(isValidSpeed(5)).toBe(false);
      expect(isValidSpeed(NaN)).toBe(false);
    });
  });

  describe('formatSpeed', () => {
    test('should format speed with 2 decimal places', () => {
      expect(formatSpeed(1)).toBe('1.00x');
      expect(formatSpeed(0.5)).toBe('0.50x');
      expect(formatSpeed(2)).toBe('2.00x');
      expect(formatSpeed(1.25)).toBe('1.25x');
    });
  });

  describe('calculateNewDuration', () => {
    test('should calculate correct duration at normal speed', () => {
      expect(calculateNewDuration(10, 1)).toBe(10);
    });

    test('should halve duration at 2x speed', () => {
      expect(calculateNewDuration(10, 2)).toBe(5);
    });

    test('should double duration at 0.5x speed', () => {
      expect(calculateNewDuration(10, 0.5)).toBe(20);
    });

    test('should handle zero speed gracefully', () => {
      expect(calculateNewDuration(10, 0)).toBe(10);
    });

    test('should handle negative speed gracefully', () => {
      expect(calculateNewDuration(10, -1)).toBe(10);
    });
  });

  describe('formatTime', () => {
    test('should format 0 seconds', () => {
      expect(formatTime(0)).toBe('0:00.0');
    });

    test('should format seconds', () => {
      expect(formatTime(5.5)).toBe('0:05.5');
    });

    test('should format minutes', () => {
      expect(formatTime(65)).toBe('1:05.0');
    });
  });

  describe('generateOutputFilename', () => {
    test('should include speed in filename', () => {
      expect(generateOutputFilename('song.mp3', 1.5)).toBe('song_1_50x.wav');
    });

    test('should handle files with multiple dots', () => {
      expect(generateOutputFilename('my.song.wav', 2)).toBe('my.song_2_00x.wav');
    });

    test('should always output as wav', () => {
      const result = generateOutputFilename('audio.ogg', 0.5);
      expect(result).toContain('.wav');
      expect(result).toContain('0_50x');
    });
  });

  describe('SPEED_PRESETS', () => {
    test('should include common speed values', () => {
      expect(SPEED_PRESETS).toContain(0.5);
      expect(SPEED_PRESETS).toContain(1);
      expect(SPEED_PRESETS).toContain(1.5);
      expect(SPEED_PRESETS).toContain(2);
    });

    test('should be sorted in ascending order', () => {
      for (let i = 1; i < SPEED_PRESETS.length; i++) {
        expect(SPEED_PRESETS[i]).toBeGreaterThan(SPEED_PRESETS[i - 1]);
      }
    });

    test('should all be valid speeds', () => {
      SPEED_PRESETS.forEach((speed) => {
        expect(isValidSpeed(speed)).toBe(true);
      });
    });
  });
});
