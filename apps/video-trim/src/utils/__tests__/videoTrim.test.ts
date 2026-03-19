import { describe, expect, it } from 'vitest';
import {
  formatTime,
  parseTime,
  validateTrimRange,
  getOutputFileName,
} from '../videoTrim';

describe('formatTime', () => {
  it('formats seconds to mm:ss.ms format', () => {
    expect(formatTime(0)).toBe('00:00.00');
    expect(formatTime(65)).toBe('01:05.00');
    expect(formatTime(3661.5)).toBe('1:01:01.50');
  });

  it('formats fractional seconds', () => {
    expect(formatTime(1.5)).toBe('00:01.50');
    expect(formatTime(0.25)).toBe('00:00.25');
  });

  it('handles large values with hours', () => {
    expect(formatTime(7200)).toBe('2:00:00.00');
  });
});

describe('parseTime', () => {
  it('parses mm:ss format', () => {
    expect(parseTime('01:30')).toBe(90);
    expect(parseTime('00:05')).toBe(5);
  });

  it('parses h:mm:ss format', () => {
    expect(parseTime('1:01:01')).toBe(3661);
  });

  it('parses raw seconds', () => {
    expect(parseTime('45')).toBe(45);
    expect(parseTime('120.5')).toBe(120.5);
  });

  it('handles invalid input', () => {
    expect(parseTime('')).toBe(0);
    expect(parseTime('abc')).toBe(0);
  });
});

describe('validateTrimRange', () => {
  it('accepts valid ranges', () => {
    expect(validateTrimRange(0, 10, 60)).toEqual({ valid: true });
    expect(validateTrimRange(5, 30, 60)).toEqual({ valid: true });
  });

  it('rejects negative start time', () => {
    const result = validateTrimRange(-1, 10, 60);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('negative');
  });

  it('rejects end time <= start time', () => {
    const result = validateTrimRange(10, 5, 60);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('greater');
  });

  it('rejects end time > duration', () => {
    const result = validateTrimRange(0, 70, 60);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds');
  });

  it('rejects too short segments', () => {
    const result = validateTrimRange(10, 10.05, 60);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('0.1');
  });
});

describe('getOutputFileName', () => {
  it('adds suffix to filename', () => {
    expect(getOutputFileName('video.mp4')).toBe('video_trimmed.webm');
    expect(getOutputFileName('my-clip.mov')).toBe('my-clip_trimmed.webm');
  });

  it('uses custom suffix', () => {
    expect(getOutputFileName('video.mp4', 'cut')).toBe('video_cut.webm');
  });

  it('handles files without extension', () => {
    expect(getOutputFileName('video')).toBe('video_trimmed');
  });
});
