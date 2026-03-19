export interface ExifInfo {
  hasExif: boolean;
  app1Offset: number;
  app1Length: number;
  make?: string;
  model?: string;
  orientation?: number;
  dateTime?: string;
  software?: string;
  imageWidth?: number;
  imageHeight?: number;
}

/**
 * Find the APP1 (EXIF) marker in a JPEG file.
 * JPEG files start with 0xFFD8. APP1 marker is 0xFFE1.
 */
export function findExifMarker(data: Uint8Array): { offset: number; length: number } | null {
  if (data.length < 4) return null;
  // Verify JPEG SOI marker
  if (data[0] !== 0xff || data[1] !== 0xd8) return null;

  let offset = 2;
  while (offset < data.length - 1) {
    if (data[offset] !== 0xff) {
      offset++;
      continue;
    }

    const marker = data[offset + 1];

    // APP1 marker = 0xE1
    if (marker === 0xe1) {
      if (offset + 3 >= data.length) return null;
      const length = (data[offset + 2] << 8) | data[offset + 3];
      return { offset, length: length + 2 }; // +2 for marker bytes
    }

    // Skip other markers
    if (marker >= 0xe0 && marker <= 0xef) {
      // APP markers
      if (offset + 3 >= data.length) return null;
      const length = (data[offset + 2] << 8) | data[offset + 3];
      offset += length + 2;
      continue;
    }

    // SOS marker - stop searching
    if (marker === 0xda) break;

    // Other markers with length
    if (offset + 3 < data.length) {
      const length = (data[offset + 2] << 8) | data[offset + 3];
      offset += length + 2;
    } else {
      break;
    }
  }

  return null;
}

/**
 * Parse basic EXIF information from a JPEG Uint8Array.
 */
export function parseExifInfo(data: Uint8Array): ExifInfo {
  const marker = findExifMarker(data);
  if (!marker) {
    return { hasExif: false, app1Offset: -1, app1Length: 0 };
  }

  const info: ExifInfo = {
    hasExif: true,
    app1Offset: marker.offset,
    app1Length: marker.length,
  };

  // Try to parse basic EXIF fields
  try {
    const exifStart = marker.offset + 4; // Skip FFE1 + length
    // Check for "Exif\0\0" header
    if (
      data[exifStart] === 0x45 &&
      data[exifStart + 1] === 0x78 &&
      data[exifStart + 2] === 0x69 &&
      data[exifStart + 3] === 0x66
    ) {
      const tiffStart = exifStart + 6;
      const isLittleEndian = data[tiffStart] === 0x49 && data[tiffStart + 1] === 0x49;

      const readU16 = (offset: number): number => {
        if (isLittleEndian) {
          return data[offset] | (data[offset + 1] << 8);
        }
        return (data[offset] << 8) | data[offset + 1];
      };

      const readU32 = (offset: number): number => {
        if (isLittleEndian) {
          return data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16) | (data[offset + 3] << 24);
        }
        return (data[offset] << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8) | data[offset + 3];
      };

      const readString = (offset: number, length: number): string => {
        let str = '';
        for (let i = 0; i < length; i++) {
          const code = data[offset + i];
          if (code === 0) break;
          str += String.fromCharCode(code);
        }
        return str.trim();
      };

      // Read IFD0
      const ifdOffset = tiffStart + readU32(tiffStart + 4);
      const numEntries = readU16(ifdOffset);

      for (let i = 0; i < numEntries; i++) {
        const entryOffset = ifdOffset + 2 + i * 12;
        if (entryOffset + 12 > data.length) break;

        const tag = readU16(entryOffset);
        const type = readU16(entryOffset + 2);
        const count = readU32(entryOffset + 4);
        const valueOffset = entryOffset + 8;

        switch (tag) {
          case 0x010f: { // Make
            const strOffset = count > 4 ? tiffStart + readU32(valueOffset) : valueOffset;
            info.make = readString(strOffset, Math.min(count, 64));
            break;
          }
          case 0x0110: { // Model
            const strOffset = count > 4 ? tiffStart + readU32(valueOffset) : valueOffset;
            info.model = readString(strOffset, Math.min(count, 64));
            break;
          }
          case 0x0112: // Orientation
            info.orientation = readU16(valueOffset);
            break;
          case 0x0131: { // Software
            const strOffset = count > 4 ? tiffStart + readU32(valueOffset) : valueOffset;
            info.software = readString(strOffset, Math.min(count, 64));
            break;
          }
          case 0x0132: { // DateTime
            const strOffset = count > 4 ? tiffStart + readU32(valueOffset) : valueOffset;
            info.dateTime = readString(strOffset, Math.min(count, 64));
            break;
          }
          case 0xa002: // PixelXDimension
            info.imageWidth = type === 3 ? readU16(valueOffset) : readU32(valueOffset);
            break;
          case 0xa003: // PixelYDimension
            info.imageHeight = type === 3 ? readU16(valueOffset) : readU32(valueOffset);
            break;
        }
      }
    }
  } catch {
    // Parsing failed, but we still know EXIF exists
  }

  return info;
}

/**
 * Remove all EXIF data (APP1 segment) from a JPEG.
 * Returns a new Uint8Array without the APP1 segment.
 */
export function removeExif(data: Uint8Array): Uint8Array {
  const marker = findExifMarker(data);
  if (!marker) return data;

  const before = data.slice(0, marker.offset);
  const after = data.slice(marker.offset + marker.length);

  const result = new Uint8Array(before.length + after.length);
  result.set(before, 0);
  result.set(after, before.length);

  return result;
}

/**
 * Check if a Uint8Array is a valid JPEG.
 */
export function isJPEG(data: Uint8Array): boolean {
  return data.length >= 2 && data[0] === 0xff && data[1] === 0xd8;
}
