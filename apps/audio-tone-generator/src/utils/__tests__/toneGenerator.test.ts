import { describe, test, expect } from 'vitest';
import {
  clampFrequency,
  clampVolume,
  clampDuration,
  isValidFrequency,
  isValidWaveform,
  frequencyToNote,
  MIN_FREQUENCY,
  MAX_FREQUENCY,
} from '../toneGenerator';

describe('toneGenerator', () => {
  describe('clampFrequency', () => {
    test('should return value within range', () => {
      expect(clampFrequency(440)).toBe(440);
    });

    test('should clamp below minimum', () => {
      expect(clampFrequency(10)).toBe(MIN_FREQUENCY);
      expect(clampFrequency(-100)).toBe(MIN_FREQUENCY);
    });

    test('should clamp above maximum', () => {
      expect(clampFrequency(25000)).toBe(MAX_FREQUENCY);
    });

    test('should handle boundary values', () => {
      expect(clampFrequency(MIN_FREQUENCY)).toBe(MIN_FREQUENCY);
      expect(clampFrequency(MAX_FREQUENCY)).toBe(MAX_FREQUENCY);
    });
  });

  describe('clampVolume', () => {
    test('should return value within range', () => {
      expect(clampVolume(0.5)).toBe(0.5);
    });

    test('should clamp below 0', () => {
      expect(clampVolume(-0.5)).toBe(0);
    });

    test('should clamp above 1', () => {
      expect(clampVolume(1.5)).toBe(1);
    });

    test('should handle boundary values', () => {
      expect(clampVolume(0)).toBe(0);
      expect(clampVolume(1)).toBe(1);
    });
  });

  describe('clampDuration', () => {
    test('should return value within range', () => {
      expect(clampDuration(1)).toBe(1);
    });

    test('should clamp below minimum', () => {
      expect(clampDuration(0.01)).toBe(0.1);
    });

    test('should clamp above maximum', () => {
      expect(clampDuration(60)).toBe(30);
    });
  });

  describe('isValidFrequency', () => {
    test('should return true for valid frequencies', () => {
      expect(isValidFrequency(440)).toBe(true);
      expect(isValidFrequency(20)).toBe(true);
      expect(isValidFrequency(20000)).toBe(true);
    });

    test('should return false for out of range frequencies', () => {
      expect(isValidFrequency(10)).toBe(false);
      expect(isValidFrequency(25000)).toBe(false);
    });

    test('should return false for NaN', () => {
      expect(isValidFrequency(NaN)).toBe(false);
    });
  });

  describe('isValidWaveform', () => {
    test('should return true for valid waveforms', () => {
      expect(isValidWaveform('sine')).toBe(true);
      expect(isValidWaveform('square')).toBe(true);
      expect(isValidWaveform('sawtooth')).toBe(true);
      expect(isValidWaveform('triangle')).toBe(true);
    });

    test('should return false for invalid waveforms', () => {
      expect(isValidWaveform('noise')).toBe(false);
      expect(isValidWaveform('')).toBe(false);
    });
  });

  describe('frequencyToNote', () => {
    test('should return A4 for 440Hz', () => {
      expect(frequencyToNote(440)).toBe('A4 (+0 cents)');
    });

    test('should return C4 for ~261.63Hz', () => {
      const result = frequencyToNote(261.63);
      expect(result).toContain('C4');
    });

    test('should return correct note for 880Hz (A5)', () => {
      expect(frequencyToNote(880)).toBe('A5 (+0 cents)');
    });

    test('should show cents deviation', () => {
      const result = frequencyToNote(445);
      expect(result).toContain('A4');
      expect(result).toContain('+');
    });
  });
});
