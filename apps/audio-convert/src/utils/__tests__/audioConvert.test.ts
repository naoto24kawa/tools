import { describe, it, expect } from 'vitest';
import {
  getDefaultOptions,
  getMimeType,
  getFileExtension,
  formatFileSize,
  formatDuration,
  getOutputFileName,
  FORMAT_OPTIONS,
  SAMPLE_RATES,
  BIT_RATES,
} from '../audioConvert';

describe('audioConvert', () => {
  describe('getDefaultOptions', () => {
    it('returns default conversion options', () => {
      const opts = getDefaultOptions();
      expect(opts.format).toBe('wav');
      expect(opts.sampleRate).toBe(44100);
      expect(opts.bitRate).toBe(128);
    });
  });

  describe('getMimeType', () => {
    it('returns correct MIME type for wav', () => {
      expect(getMimeType('wav')).toBe('audio/wav');
    });

    it('returns correct MIME type for webm', () => {
      expect(getMimeType('webm')).toBe('audio/webm;codecs=opus');
    });

    it('returns correct MIME type for ogg', () => {
      expect(getMimeType('ogg')).toBe('audio/ogg;codecs=opus');
    });
  });

  describe('getFileExtension', () => {
    it('returns wav for wav format', () => {
      expect(getFileExtension('wav')).toBe('wav');
    });

    it('returns webm for webm format', () => {
      expect(getFileExtension('webm')).toBe('webm');
    });

    it('returns ogg for ogg format', () => {
      expect(getFileExtension('ogg')).toBe('ogg');
    });
  });

  describe('formatFileSize', () => {
    it('formats 0 bytes', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('formats bytes', () => {
      expect(formatFileSize(500)).toBe('500.0 B');
    });

    it('formats kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB');
    });

    it('formats megabytes', () => {
      expect(formatFileSize(1048576)).toBe('1.0 MB');
    });

    it('formats gigabytes', () => {
      expect(formatFileSize(1073741824)).toBe('1.0 GB');
    });
  });

  describe('formatDuration', () => {
    it('formats zero seconds', () => {
      expect(formatDuration(0)).toBe('0:00');
    });

    it('formats seconds less than a minute', () => {
      expect(formatDuration(45)).toBe('0:45');
    });

    it('formats minutes and seconds', () => {
      expect(formatDuration(125)).toBe('2:05');
    });

    it('pads single-digit seconds', () => {
      expect(formatDuration(63)).toBe('1:03');
    });
  });

  describe('getOutputFileName', () => {
    it('replaces extension with target format', () => {
      expect(getOutputFileName('song.mp3', 'wav')).toBe('song.wav');
    });

    it('handles files without extension', () => {
      expect(getOutputFileName('song', 'ogg')).toBe('song.ogg');
    });

    it('handles files with multiple dots', () => {
      expect(getOutputFileName('my.song.file.mp3', 'webm')).toBe('my.song.file.webm');
    });
  });

  describe('constants', () => {
    it('has format options', () => {
      expect(FORMAT_OPTIONS).toHaveLength(3);
      expect(FORMAT_OPTIONS.map((f) => f.value)).toEqual(['wav', 'webm', 'ogg']);
    });

    it('has sample rates', () => {
      expect(SAMPLE_RATES).toContain(44100);
      expect(SAMPLE_RATES).toContain(48000);
    });

    it('has bit rates', () => {
      expect(BIT_RATES).toContain(128);
      expect(BIT_RATES).toContain(320);
    });
  });
});
