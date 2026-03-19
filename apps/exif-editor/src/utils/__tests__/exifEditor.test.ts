import { describe, it, expect } from 'vitest';
import { findExifMarker, removeExif, isJPEG, parseExifInfo } from '../exifEditor';

// Helper to create a minimal JPEG with APP1 (EXIF) marker
function createJpegWithExif(): Uint8Array {
  // FFD8 (SOI) + FFE1 (APP1) + length 0x0008 + "Exif\0\0"
  return new Uint8Array([
    0xff, 0xd8, // SOI
    0xff, 0xe1, // APP1 marker
    0x00, 0x08, // Length = 8 (includes length bytes)
    0x45, 0x78, 0x69, 0x66, 0x00, 0x00, // "Exif\0\0"
    0xff, 0xd9, // EOI
  ]);
}

function createJpegWithoutExif(): Uint8Array {
  // FFD8 (SOI) + FFE0 (APP0/JFIF) + length 0x0004 + data + EOI
  return new Uint8Array([
    0xff, 0xd8, // SOI
    0xff, 0xe0, // APP0
    0x00, 0x04, // Length
    0x00, 0x00, // dummy data
    0xff, 0xd9, // EOI
  ]);
}

describe('isJPEG', () => {
  it('returns true for valid JPEG', () => {
    expect(isJPEG(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe(true);
  });

  it('returns false for non-JPEG', () => {
    expect(isJPEG(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBe(false); // PNG
  });

  it('returns false for short data', () => {
    expect(isJPEG(new Uint8Array([0xff]))).toBe(false);
  });
});

describe('findExifMarker', () => {
  it('finds APP1 marker in JPEG with EXIF', () => {
    const data = createJpegWithExif();
    const result = findExifMarker(data);
    expect(result).not.toBeNull();
    expect(result!.offset).toBe(2);
  });

  it('returns null for JPEG without EXIF', () => {
    const data = createJpegWithoutExif();
    const result = findExifMarker(data);
    expect(result).toBeNull();
  });

  it('returns null for non-JPEG data', () => {
    const data = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    expect(findExifMarker(data)).toBeNull();
  });
});

describe('parseExifInfo', () => {
  it('detects EXIF presence', () => {
    const data = createJpegWithExif();
    const info = parseExifInfo(data);
    expect(info.hasExif).toBe(true);
    expect(info.app1Offset).toBe(2);
  });

  it('detects no EXIF', () => {
    const data = createJpegWithoutExif();
    const info = parseExifInfo(data);
    expect(info.hasExif).toBe(false);
  });
});

describe('removeExif', () => {
  it('removes APP1 segment', () => {
    const data = createJpegWithExif();
    const cleaned = removeExif(data);

    // Should still be valid JPEG
    expect(cleaned[0]).toBe(0xff);
    expect(cleaned[1]).toBe(0xd8);

    // Should not contain APP1 marker anymore
    expect(findExifMarker(cleaned)).toBeNull();

    // Should be shorter
    expect(cleaned.length).toBeLessThan(data.length);
  });

  it('returns same data if no EXIF', () => {
    const data = createJpegWithoutExif();
    const cleaned = removeExif(data);
    expect(cleaned.length).toBe(data.length);
  });
});
