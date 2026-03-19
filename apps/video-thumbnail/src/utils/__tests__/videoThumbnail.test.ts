import { describe, expect, it } from 'vitest';
import {
  formatTime,
  generateId,
  getMimeType,
  getFileExtension,
  getDownloadFileName,
  dataUrlToBlob,
} from '../videoThumbnail';

describe('formatTime', () => {
  it('formats seconds to mm:ss.ms format', () => {
    expect(formatTime(0)).toBe('00:00.00');
    expect(formatTime(65)).toBe('01:05.00');
  });

  it('formats with hours when needed', () => {
    expect(formatTime(3661.5)).toBe('1:01:01.50');
  });

  it('handles fractional seconds', () => {
    expect(formatTime(1.5)).toBe('00:01.50');
  });
});

describe('generateId', () => {
  it('generates unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^thumb_/);
  });
});

describe('getMimeType', () => {
  it('returns correct MIME types', () => {
    expect(getMimeType('png')).toBe('image/png');
    expect(getMimeType('jpeg')).toBe('image/jpeg');
  });
});

describe('getFileExtension', () => {
  it('returns correct extensions', () => {
    expect(getFileExtension('png')).toBe('.png');
    expect(getFileExtension('jpeg')).toBe('.jpg');
  });
});

describe('getDownloadFileName', () => {
  it('creates filename with timestamp', () => {
    const result = getDownloadFileName('video.mp4', 65.5, 'png');
    expect(result).toBe('video_01-05-50.png');
  });

  it('handles files without extension', () => {
    const result = getDownloadFileName('myvideo', 0, 'jpeg');
    expect(result).toBe('myvideo_00-00-00.jpg');
  });
});

describe('dataUrlToBlob', () => {
  it('converts a data URL to a Blob', () => {
    // Small 1x1 red PNG
    const dataUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const blob = dataUrlToBlob(dataUrl);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('image/png');
    expect(blob.size).toBeGreaterThan(0);
  });
});
