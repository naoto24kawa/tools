import { describe, it, expect } from 'vitest';
import {
  getDefaultMergeOptions,
  generateId,
  formatDuration,
  formatFileSize,
  moveTrack,
  removeTrack,
  calculateTotalDuration,
  type AudioTrack,
} from '../audioMerge';

function createMockTrack(overrides: Partial<AudioTrack> = {}): AudioTrack {
  return {
    id: 'test-id',
    file: new File([], 'test.wav'),
    name: 'test.wav',
    duration: 10,
    sampleRate: 44100,
    channels: 2,
    buffer: {} as AudioBuffer,
    ...overrides,
  };
}

describe('audioMerge', () => {
  describe('getDefaultMergeOptions', () => {
    it('returns default merge options', () => {
      const opts = getDefaultMergeOptions();
      expect(opts.gapSeconds).toBe(0);
      expect(opts.crossfadeSeconds).toBe(0);
      expect(opts.outputSampleRate).toBe(44100);
    });
  });

  describe('generateId', () => {
    it('generates unique ids', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('generates string ids', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
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
  });

  describe('formatFileSize', () => {
    it('formats zero', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('formats KB', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB');
    });

    it('formats MB', () => {
      expect(formatFileSize(1048576)).toBe('1.0 MB');
    });
  });

  describe('moveTrack', () => {
    const tracks = [
      createMockTrack({ id: 'a', name: 'a.wav' }),
      createMockTrack({ id: 'b', name: 'b.wav' }),
      createMockTrack({ id: 'c', name: 'c.wav' }),
    ];

    it('moves track up', () => {
      const result = moveTrack(tracks, 1, 'up');
      expect(result[0].id).toBe('b');
      expect(result[1].id).toBe('a');
      expect(result[2].id).toBe('c');
    });

    it('moves track down', () => {
      const result = moveTrack(tracks, 1, 'down');
      expect(result[0].id).toBe('a');
      expect(result[1].id).toBe('c');
      expect(result[2].id).toBe('b');
    });

    it('does not move first track up', () => {
      const result = moveTrack(tracks, 0, 'up');
      expect(result[0].id).toBe('a');
    });

    it('does not move last track down', () => {
      const result = moveTrack(tracks, 2, 'down');
      expect(result[2].id).toBe('c');
    });
  });

  describe('removeTrack', () => {
    it('removes track at index', () => {
      const tracks = [
        createMockTrack({ id: 'a' }),
        createMockTrack({ id: 'b' }),
        createMockTrack({ id: 'c' }),
      ];
      const result = removeTrack(tracks, 1);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('a');
      expect(result[1].id).toBe('c');
    });
  });

  describe('calculateTotalDuration', () => {
    it('returns 0 for empty tracks', () => {
      expect(calculateTotalDuration([], getDefaultMergeOptions())).toBe(0);
    });

    it('returns single track duration', () => {
      const tracks = [createMockTrack({ duration: 10 })];
      expect(calculateTotalDuration(tracks, getDefaultMergeOptions())).toBe(10);
    });

    it('sums durations without gap', () => {
      const tracks = [
        createMockTrack({ duration: 10 }),
        createMockTrack({ duration: 5 }),
      ];
      expect(calculateTotalDuration(tracks, getDefaultMergeOptions())).toBe(15);
    });

    it('adds gap between tracks', () => {
      const tracks = [
        createMockTrack({ duration: 10 }),
        createMockTrack({ duration: 5 }),
      ];
      const opts = { ...getDefaultMergeOptions(), gapSeconds: 2 };
      expect(calculateTotalDuration(tracks, opts)).toBe(17);
    });

    it('subtracts crossfade from total', () => {
      const tracks = [
        createMockTrack({ duration: 10 }),
        createMockTrack({ duration: 5 }),
      ];
      const opts = { ...getDefaultMergeOptions(), crossfadeSeconds: 1 };
      expect(calculateTotalDuration(tracks, opts)).toBe(14);
    });

    it('handles multiple gaps', () => {
      const tracks = [
        createMockTrack({ duration: 10 }),
        createMockTrack({ duration: 5 }),
        createMockTrack({ duration: 8 }),
      ];
      const opts = { ...getDefaultMergeOptions(), gapSeconds: 1 };
      expect(calculateTotalDuration(tracks, opts)).toBe(25);
    });
  });
});
