export interface DetectionResult {
  encoding: string;
  confidence: number;
  description: string;
}

export function detectEncoding(bytes: Uint8Array): DetectionResult[] {
  const results: DetectionResult[] = [];

  const utf8Score = checkUtf8(bytes);
  if (utf8Score > 0) {
    results.push({
      encoding: 'UTF-8',
      confidence: utf8Score,
      description: 'Unicode UTF-8 encoding',
    });
  }

  const sjisScore = checkShiftJIS(bytes);
  if (sjisScore > 0) {
    results.push({
      encoding: 'Shift_JIS',
      confidence: sjisScore,
      description: 'Japanese Shift_JIS encoding',
    });
  }

  const eucjpScore = checkEUCJP(bytes);
  if (eucjpScore > 0) {
    results.push({
      encoding: 'EUC-JP',
      confidence: eucjpScore,
      description: 'Japanese EUC-JP encoding',
    });
  }

  const asciiScore = checkASCII(bytes);
  if (asciiScore > 0) {
    results.push({
      encoding: 'ASCII',
      confidence: asciiScore,
      description: 'US-ASCII (7-bit)',
    });
  }

  const iso8859Score = checkISO8859(bytes);
  if (iso8859Score > 0) {
    results.push({
      encoding: 'ISO-8859-1',
      confidence: iso8859Score,
      description: 'Latin-1 (Western European)',
    });
  }

  // Check for BOM
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    results.unshift({
      encoding: 'UTF-8 (BOM)',
      confidence: 100,
      description: 'UTF-8 with Byte Order Mark',
    });
  }
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    results.unshift({
      encoding: 'UTF-16LE',
      confidence: 95,
      description: 'UTF-16 Little Endian',
    });
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    results.unshift({
      encoding: 'UTF-16BE',
      confidence: 95,
      description: 'UTF-16 Big Endian',
    });
  }

  results.sort((a, b) => b.confidence - a.confidence);
  return results;
}

function checkASCII(bytes: Uint8Array): number {
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] > 127) return 0;
  }
  return bytes.length > 0 ? 90 : 0;
}

function checkUtf8(bytes: Uint8Array): number {
  let multibyteCount = 0;
  let i = 0;
  let valid = true;

  while (i < bytes.length) {
    const byte = bytes[i];
    if (byte <= 0x7f) {
      i++;
    } else if (byte >= 0xc2 && byte <= 0xdf) {
      if (i + 1 >= bytes.length || (bytes[i + 1] & 0xc0) !== 0x80) {
        valid = false;
        break;
      }
      multibyteCount++;
      i += 2;
    } else if (byte >= 0xe0 && byte <= 0xef) {
      if (
        i + 2 >= bytes.length ||
        (bytes[i + 1] & 0xc0) !== 0x80 ||
        (bytes[i + 2] & 0xc0) !== 0x80
      ) {
        valid = false;
        break;
      }
      multibyteCount++;
      i += 3;
    } else if (byte >= 0xf0 && byte <= 0xf4) {
      if (
        i + 3 >= bytes.length ||
        (bytes[i + 1] & 0xc0) !== 0x80 ||
        (bytes[i + 2] & 0xc0) !== 0x80 ||
        (bytes[i + 3] & 0xc0) !== 0x80
      ) {
        valid = false;
        break;
      }
      multibyteCount++;
      i += 4;
    } else {
      valid = false;
      break;
    }
  }

  if (!valid) return 0;
  return multibyteCount > 0 ? 95 : 50;
}

function checkShiftJIS(bytes: Uint8Array): number {
  let sjisChars = 0;
  let i = 0;
  let valid = true;

  while (i < bytes.length) {
    const byte = bytes[i];
    if (byte <= 0x7f) {
      i++;
    } else if (byte >= 0xa1 && byte <= 0xdf) {
      // Half-width katakana
      sjisChars++;
      i++;
    } else if (
      (byte >= 0x81 && byte <= 0x9f) ||
      (byte >= 0xe0 && byte <= 0xef)
    ) {
      if (i + 1 >= bytes.length) {
        valid = false;
        break;
      }
      const nextByte = bytes[i + 1];
      if (
        (nextByte >= 0x40 && nextByte <= 0x7e) ||
        (nextByte >= 0x80 && nextByte <= 0xfc)
      ) {
        sjisChars++;
        i += 2;
      } else {
        valid = false;
        break;
      }
    } else {
      valid = false;
      break;
    }
  }

  if (!valid) return 0;
  return sjisChars > 0 ? 80 : 0;
}

function checkEUCJP(bytes: Uint8Array): number {
  let eucChars = 0;
  let i = 0;
  let valid = true;

  while (i < bytes.length) {
    const byte = bytes[i];
    if (byte <= 0x7f) {
      i++;
    } else if (byte >= 0xa1 && byte <= 0xfe) {
      if (i + 1 >= bytes.length || bytes[i + 1] < 0xa1 || bytes[i + 1] > 0xfe) {
        valid = false;
        break;
      }
      eucChars++;
      i += 2;
    } else if (byte === 0x8e) {
      if (i + 1 >= bytes.length || bytes[i + 1] < 0xa1 || bytes[i + 1] > 0xdf) {
        valid = false;
        break;
      }
      eucChars++;
      i += 2;
    } else {
      valid = false;
      break;
    }
  }

  if (!valid) return 0;
  return eucChars > 0 ? 75 : 0;
}

function checkISO8859(bytes: Uint8Array): number {
  let highChars = 0;
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    if (byte >= 0x80 && byte <= 0x9f) return 0; // Control chars in ISO-8859-1 range
    if (byte >= 0xa0) highChars++;
  }
  return highChars > 0 ? 40 : 0;
}

export function decodeWithEncoding(bytes: Uint8Array, encoding: string): string {
  try {
    const cleanEncoding = encoding.replace(' (BOM)', '');
    const decoder = new TextDecoder(cleanEncoding);
    return decoder.decode(bytes);
  } catch {
    return '(Decoding failed for this encoding)';
  }
}

export function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
}
