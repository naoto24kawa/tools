import { describe, expect, it } from 'vitest';
import {
  getVideoBitsPerSecond,
  getTargetDimensions,
  formatFileSize,
  calculateCompressionRatio,
  getOutputFileName,
  getQualityLabel,
} from '../videoCompress';

describe('getVideoBitsPerSecond', () => {
  it('returns correct bitrate for each quality', () => {
    expect(getVideoBitsPerSecond('low')).toBe(500_000);
    expect(getVideoBitsPerSecond('medium')).toBe(1_500_000);
    expect(getVideoBitsPerSecond('high')).toBe(3_000_000);
  });
});

describe('getTargetDimensions', () => {
  it('returns original dimensions when resolution is original', () => {
    expect(getTargetDimensions(1920, 1080, 'original')).toEqual({
      width: 1920,
      height: 1080,
    });
  });

  it('scales down to 720p maintaining aspect ratio', () => {
    const result = getTargetDimensions(1920, 1080, '720p');
    expect(result.height).toBe(720);
    expect(result.width).toBe(1280);
  });

  it('scales down to 480p maintaining aspect ratio', () => {
    const result = getTargetDimensions(1920, 1080, '480p');
    expect(result.height).toBe(480);
    expect(result.width).toBe(854);
  });

  it('does not upscale if video is smaller than target', () => {
    const result = getTargetDimensions(640, 360, '720p');
    expect(result).toEqual({ width: 640, height: 360 });
  });

  it('ensures even dimensions', () => {
    const result = getTargetDimensions(1921, 1081, '720p');
    expect(result.width % 2).toBe(0);
    expect(result.height % 2).toBe(0);
  });
});

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

  it('formats gigabytes', () => {
    expect(formatFileSize(2.5 * 1024 * 1024 * 1024)).toBe('2.50 GB');
  });
});

describe('calculateCompressionRatio', () => {
  it('calculates compression percentage', () => {
    expect(calculateCompressionRatio(100, 50)).toBe('50.0%');
    expect(calculateCompressionRatio(100, 75)).toBe('25.0%');
  });

  it('handles zero original size', () => {
    expect(calculateCompressionRatio(0, 0)).toBe('0%');
  });
});

describe('getOutputFileName', () => {
  it('adds compressed suffix', () => {
    expect(getOutputFileName('video.mp4')).toBe('video_compressed.webm');
  });

  it('handles files without extension', () => {
    expect(getOutputFileName('video')).toBe('video_compressed');
  });
});

describe('getQualityLabel', () => {
  it('returns correct labels', () => {
    expect(getQualityLabel('low')).toContain('500');
    expect(getQualityLabel('medium')).toContain('1.5');
    expect(getQualityLabel('high')).toContain('3');
  });
});
