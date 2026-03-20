/**
 * Create a ZIP file from multiple files using manual ZIP format construction.
 * Implements basic ZIP format: Local File Headers + File Data + Central Directory + EOCD.
 * Supports Store (no compression) and Deflate compression via WASM.
 */

import { crc32_raw, deflate } from 'wasm-utils';

interface ZipEntry {
  name: string;
  data: Uint8Array;
  compressedData: Uint8Array;
  crc32: number;
  compressionMethod: number;
}

/**
 * Create a ZIP file containing the given files.
 * @param files - Files to include in the archive
 * @param compress - Whether to use Deflate compression (default: false for backward compat)
 */
export async function createZip(files: File[], compress?: boolean): Promise<Blob> {
  const entries: ZipEntry[] = [];

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    const crc = crc32_raw(data);

    let compressedData: Uint8Array;
    let compressionMethod: number;

    if (compress) {
      compressedData = deflate(data, 6);
      compressionMethod = 8; // Deflate
    } else {
      compressedData = data;
      compressionMethod = 0; // Store
    }

    entries.push({
      name: file.name,
      data,
      compressedData,
      crc32: crc,
      compressionMethod,
    });
  }

  return buildZipBlob(entries);
}

function buildZipBlob(entries: ZipEntry[]): Blob {
  const parts: Uint8Array[] = [];
  const centralDirectory: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = new TextEncoder().encode(entry.name);

    // Local file header
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lhView = new DataView(localHeader.buffer);
    lhView.setUint32(0, 0x04034b50, true); // Local file header signature
    lhView.setUint16(4, 20, true); // Version needed
    lhView.setUint16(6, 0, true); // General purpose bit flag
    lhView.setUint16(8, entry.compressionMethod, true); // Compression method
    lhView.setUint16(10, 0, true); // Last mod file time
    lhView.setUint16(12, 0, true); // Last mod file date
    lhView.setUint32(14, entry.crc32, true); // CRC-32
    lhView.setUint32(18, entry.compressedData.length, true); // Compressed size
    lhView.setUint32(22, entry.data.length, true); // Uncompressed size
    lhView.setUint16(26, nameBytes.length, true); // File name length
    lhView.setUint16(28, 0, true); // Extra field length
    localHeader.set(nameBytes, 30);

    parts.push(localHeader);
    parts.push(entry.compressedData);

    // Central directory entry
    const cdEntry = new Uint8Array(46 + nameBytes.length);
    const cdView = new DataView(cdEntry.buffer);
    cdView.setUint32(0, 0x02014b50, true); // Central directory file header signature
    cdView.setUint16(4, 20, true); // Version made by
    cdView.setUint16(6, 20, true); // Version needed
    cdView.setUint16(8, 0, true); // General purpose bit flag
    cdView.setUint16(10, entry.compressionMethod, true); // Compression method
    cdView.setUint16(12, 0, true); // Last mod file time
    cdView.setUint16(14, 0, true); // Last mod file date
    cdView.setUint32(16, entry.crc32, true); // CRC-32
    cdView.setUint32(20, entry.compressedData.length, true); // Compressed size
    cdView.setUint32(24, entry.data.length, true); // Uncompressed size
    cdView.setUint16(28, nameBytes.length, true); // File name length
    cdView.setUint16(30, 0, true); // Extra field length
    cdView.setUint16(32, 0, true); // File comment length
    cdView.setUint16(34, 0, true); // Disk number start
    cdView.setUint16(36, 0, true); // Internal file attributes
    cdView.setUint32(38, 0, true); // External file attributes
    cdView.setUint32(42, offset, true); // Relative offset of local header
    cdEntry.set(nameBytes, 46);

    centralDirectory.push(cdEntry);
    offset += localHeader.length + entry.compressedData.length;
  }

  const cdOffset = offset;
  let cdSize = 0;
  for (const cd of centralDirectory) {
    parts.push(cd);
    cdSize += cd.length;
  }

  // End of central directory record
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true); // EOCD signature
  eocdView.setUint16(4, 0, true); // Number of this disk
  eocdView.setUint16(6, 0, true); // Disk where CD starts
  eocdView.setUint16(8, entries.length, true); // Number of CD records on this disk
  eocdView.setUint16(10, entries.length, true); // Total number of CD records
  eocdView.setUint32(12, cdSize, true); // Size of CD
  eocdView.setUint32(16, cdOffset, true); // Offset of start of CD
  eocdView.setUint16(20, 0, true); // Comment length
  parts.push(eocd);

  return new Blob(parts, { type: 'application/zip' });
}

/**
 * Format file size.
 */
export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
}
