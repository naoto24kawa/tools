import { describe, expect, it } from 'vitest';
import {
  formatSpeed,
  formatFileSize,
  formatTime,
  calculateOutputDuration,
  getOutputFileName,
  clampSpeed,
} from '../videoSpeed';

describe('formatSpeed', () => {
  it('formats speed values', () => {
    expect(formatSpeed(1)).toBe('1x');
    expect(formatSpeed(0.5)).toBe('0.5x');
    expect(formatSpeed(2)).toBe('2x');
  });
});

describe('formatFileSize', () => {
  it('formats various sizes', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(2048)).toBe('2.0 KB');
    expect(formatFileSize(10 * 1024 * 1024)).toBe('10.0 MB');
  });
});

describe('formatTime', () => {
  it('formats seconds to mm:ss', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(90)).toBe('01:30');
    expect(formatTime(3600)).toBe('60:00');
  });
});

describe('calculateOutputDuration', () => {
  it('calculates duration at different speeds', () => {
    expect(calculateOutputDuration(60, 2)).toBe(30);
    expect(calculateOutputDuration(60, 0.5)).toBe(120);
    expect(calculateOutputDuration(60, 1)).toBe(60);
  });

  it('handles zero speed gracefully', () => {
    expect(calculateOutputDuration(60, 0)).toBe(60);
  });
});

describe('getOutputFileName', () => {
  it('includes speed in filename', () => {
    expect(getOutputFileName('video.mp4', 2)).toBe('video_2x.webm');
    expect(getOutputFileName('clip.mov', 0.5)).toBe('clip_0_5x.webm');
  });

  it('handles files without extension', () => {
    expect(getOutputFileName('video', 1.5)).toBe('video_1_5x');
  });
});

describe('clampSpeed', () => {
  it('clamps to valid range', () => {
    expect(clampSpeed(0.1)).toBe(0.25);
    expect(clampSpeed(5)).toBe(4);
    expect(clampSpeed(1.5)).toBe(1.5);
  });
});
