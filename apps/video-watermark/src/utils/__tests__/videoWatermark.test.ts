import { describe, expect, it } from 'vitest';
import {
  createDefaultWatermarkConfig,
  getTextPosition,
  formatFileSize,
  getOutputFileName,
  hexToRgba,
  POSITION_OPTIONS,
} from '../videoWatermark';

describe('createDefaultWatermarkConfig', () => {
  it('returns sensible defaults', () => {
    const config = createDefaultWatermarkConfig();
    expect(config.text).toBe('Watermark');
    expect(config.fontSize).toBe(24);
    expect(config.color).toBe('#ffffff');
    expect(config.opacity).toBeGreaterThan(0);
    expect(config.opacity).toBeLessThanOrEqual(1);
    expect(config.position).toBe('bottom-right');
  });
});

describe('POSITION_OPTIONS', () => {
  it('has 7 position options', () => {
    expect(POSITION_OPTIONS).toHaveLength(7);
  });

  it('each option has value and label', () => {
    for (const opt of POSITION_OPTIONS) {
      expect(opt.value).toBeTruthy();
      expect(opt.label).toBeTruthy();
    }
  });
});

describe('getTextPosition', () => {
  const width = 1920;
  const height = 1080;
  const textWidth = 100;
  const fontSize = 24;

  it('positions top-left with padding', () => {
    const pos = getTextPosition('top-left', width, height, textWidth, fontSize);
    expect(pos.x).toBe(20);
    expect(pos.y).toBe(44);
  });

  it('centers text for center position', () => {
    const pos = getTextPosition('center', width, height, textWidth, fontSize);
    expect(pos.x).toBe((width - textWidth) / 2);
    expect(pos.y).toBe((height + fontSize) / 2);
  });

  it('positions bottom-right with padding', () => {
    const pos = getTextPosition('bottom-right', width, height, textWidth, fontSize);
    expect(pos.x).toBe(width - textWidth - 20);
    expect(pos.y).toBe(height - 20);
  });

  it('positions top-center', () => {
    const pos = getTextPosition('top-center', width, height, textWidth, fontSize);
    expect(pos.x).toBe((width - textWidth) / 2);
  });

  it('positions bottom-left', () => {
    const pos = getTextPosition('bottom-left', width, height, textWidth, fontSize);
    expect(pos.x).toBe(20);
    expect(pos.y).toBe(height - 20);
  });
});

describe('formatFileSize', () => {
  it('formats various sizes', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(2048)).toBe('2.0 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
  });
});

describe('getOutputFileName', () => {
  it('adds watermarked suffix', () => {
    expect(getOutputFileName('video.mp4')).toBe('video_watermarked.webm');
    expect(getOutputFileName('my-clip.mov')).toBe('my-clip_watermarked.webm');
  });

  it('handles files without extension', () => {
    expect(getOutputFileName('video')).toBe('video_watermarked');
  });
});

describe('hexToRgba', () => {
  it('converts hex to rgba', () => {
    expect(hexToRgba('#ffffff', 0.5)).toBe('rgba(255, 255, 255, 0.5)');
    expect(hexToRgba('#000000', 1)).toBe('rgba(0, 0, 0, 1)');
    expect(hexToRgba('#ff0000', 0.75)).toBe('rgba(255, 0, 0, 0.75)');
  });
});
