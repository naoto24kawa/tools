import { describe, expect, it } from 'vitest';
import {
  formatFileSize,
  formatTime,
  getOutputFileName,
  calculateSizeReduction,
} from '../videoMute';

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
  });
});

describe('formatTime', () => {
  it('formats seconds to mm:ss', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(3600)).toBe('60:00');
  });
});

describe('getOutputFileName', () => {
  it('adds _muted suffix', () => {
    expect(getOutputFileName('video.mp4')).toBe('video_muted.webm');
    expect(getOutputFileName('my-clip.mov')).toBe('my-clip_muted.webm');
  });

  it('handles files without extension', () => {
    expect(getOutputFileName('video')).toBe('video_muted');
  });
});

describe('calculateSizeReduction', () => {
  it('calculates percentage reduction', () => {
    expect(calculateSizeReduction(100, 80)).toBe('20.0%');
    expect(calculateSizeReduction(100, 50)).toBe('50.0%');
  });

  it('handles zero original size', () => {
    expect(calculateSizeReduction(0, 0)).toBe('0%');
  });

  it('handles no reduction', () => {
    expect(calculateSizeReduction(100, 100)).toBe('0.0%');
  });
});
