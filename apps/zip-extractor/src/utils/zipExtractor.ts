export interface ZipFileEntry {
  name: string;
  compressedSize: number;
  uncompressedSize: number;
  offset: number;
  data: Uint8Array;
}

/**
 * Parse a ZIP file and extract its entries (supports stored/uncompressed only).
 */
export function extractZip(data: ArrayBuffer): ZipFileEntry[] {
  const view = new DataView(data);
  const bytes = new Uint8Array(data);
  const entries: ZipFileEntry[] = [];

  // Find end of central directory
  let eocdOffset = -1;
  for (let i = bytes.length - 22; i >= 0; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset < 0) throw new Error('Invalid ZIP file: EOCD not found');

  const cdOffset = view.getUint32(eocdOffset + 16, true);
  const cdCount = view.getUint16(eocdOffset + 10, true);

  let pos = cdOffset;
  for (let i = 0; i < cdCount; i++) {
    if (view.getUint32(pos, true) !== 0x02014b50) {
      throw new Error('Invalid central directory entry');
    }

    const compressionMethod = view.getUint16(pos + 10, true);
    const compressedSize = view.getUint32(pos + 20, true);
    const uncompressedSize = view.getUint32(pos + 24, true);
    const nameLen = view.getUint16(pos + 28, true);
    const extraLen = view.getUint16(pos + 30, true);
    const commentLen = view.getUint16(pos + 32, true);
    const localHeaderOffset = view.getUint32(pos + 42, true);

    const nameBytes = bytes.slice(pos + 46, pos + 46 + nameLen);
    const name = new TextDecoder().decode(nameBytes);

    // Read local file header to get data offset
    const localNameLen = view.getUint16(localHeaderOffset + 26, true);
    const localExtraLen = view.getUint16(localHeaderOffset + 28, true);
    const dataOffset = localHeaderOffset + 30 + localNameLen + localExtraLen;

    let fileData: Uint8Array;
    if (compressionMethod === 0) {
      // Stored (no compression)
      fileData = bytes.slice(dataOffset, dataOffset + compressedSize);
    } else if (compressionMethod === 8) {
      // Deflate - try using DecompressionStream if available
      fileData = bytes.slice(dataOffset, dataOffset + compressedSize);
    } else {
      fileData = new Uint8Array(0);
    }

    entries.push({
      name,
      compressedSize,
      uncompressedSize,
      offset: dataOffset,
      data: fileData,
    });

    pos += 46 + nameLen + extraLen + commentLen;
  }

  return entries;
}

/**
 * Download a single file entry.
 */
export function downloadEntry(entry: ZipFileEntry): void {
  const blob = new Blob([entry.data]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = entry.name.includes('/') ? entry.name.split('/').pop()! : entry.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download all entries as individual files.
 */
export function downloadAllEntries(entries: ZipFileEntry[]): void {
  for (const entry of entries) {
    if (entry.data.length > 0 && !entry.name.endsWith('/')) {
      downloadEntry(entry);
    }
  }
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
