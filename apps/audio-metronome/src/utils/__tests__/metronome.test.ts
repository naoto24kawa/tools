import { describe, test, expect } from 'vitest';
import {
  clampBpm,
  isValidBpm,
  bpmToIntervalMs,
  findTimeSignature,
  getNextBeatIndex,
  isAccentBeat,
  MIN_BPM,
  MAX_BPM,
  TIME_SIGNATURES,
} from '../metronome';

describe('metronome', () => {
  describe('clampBpm', () => {
    test('should return value within range', () => {
      expect(clampBpm(120)).toBe(120);
    });

    test('should clamp below minimum', () => {
      expect(clampBpm(10)).toBe(MIN_BPM);
      expect(clampBpm(-1)).toBe(MIN_BPM);
    });

    test('should clamp above maximum', () => {
      expect(clampBpm(300)).toBe(MAX_BPM);
    });

    test('should handle boundary values', () => {
      expect(clampBpm(MIN_BPM)).toBe(MIN_BPM);
      expect(clampBpm(MAX_BPM)).toBe(MAX_BPM);
    });
  });

  describe('isValidBpm', () => {
    test('should return true for valid BPM', () => {
      expect(isValidBpm(120)).toBe(true);
      expect(isValidBpm(40)).toBe(true);
      expect(isValidBpm(240)).toBe(true);
    });

    test('should return false for invalid BPM', () => {
      expect(isValidBpm(10)).toBe(false);
      expect(isValidBpm(300)).toBe(false);
      expect(isValidBpm(NaN)).toBe(false);
    });
  });

  describe('bpmToIntervalMs', () => {
    test('should convert 60 BPM to 1000ms', () => {
      expect(bpmToIntervalMs(60)).toBe(1000);
    });

    test('should convert 120 BPM to 500ms', () => {
      expect(bpmToIntervalMs(120)).toBe(500);
    });

    test('should convert 240 BPM to 250ms', () => {
      expect(bpmToIntervalMs(240)).toBe(250);
    });
  });

  describe('findTimeSignature', () => {
    test('should find 4/4 time signature', () => {
      const ts = findTimeSignature('4/4');
      expect(ts.beats).toBe(4);
      expect(ts.noteValue).toBe(4);
    });

    test('should find 3/4 time signature', () => {
      const ts = findTimeSignature('3/4');
      expect(ts.beats).toBe(3);
    });

    test('should find 6/8 time signature', () => {
      const ts = findTimeSignature('6/8');
      expect(ts.beats).toBe(6);
      expect(ts.noteValue).toBe(8);
    });

    test('should default to 4/4 for unknown signature', () => {
      const ts = findTimeSignature('5/4');
      expect(ts.beats).toBe(4);
      expect(ts.noteValue).toBe(4);
    });
  });

  describe('getNextBeatIndex', () => {
    test('should increment beat index', () => {
      expect(getNextBeatIndex(0, 4)).toBe(1);
      expect(getNextBeatIndex(1, 4)).toBe(2);
    });

    test('should wrap around to 0', () => {
      expect(getNextBeatIndex(3, 4)).toBe(0);
      expect(getNextBeatIndex(2, 3)).toBe(0);
    });
  });

  describe('isAccentBeat', () => {
    test('should return true for beat 0', () => {
      expect(isAccentBeat(0)).toBe(true);
    });

    test('should return false for other beats', () => {
      expect(isAccentBeat(1)).toBe(false);
      expect(isAccentBeat(2)).toBe(false);
      expect(isAccentBeat(3)).toBe(false);
    });
  });

  describe('TIME_SIGNATURES', () => {
    test('should have 4 time signatures', () => {
      expect(TIME_SIGNATURES).toHaveLength(4);
    });

    test('should include common time signatures', () => {
      const labels = TIME_SIGNATURES.map((ts) => ts.label);
      expect(labels).toContain('2/4');
      expect(labels).toContain('3/4');
      expect(labels).toContain('4/4');
      expect(labels).toContain('6/8');
    });
  });
});
