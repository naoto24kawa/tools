export interface ZipFileEntry {
  name: string;
  compressedSize: number;
  uncompressedSize: number;
  offset: number;
  data: Uint8Array;
  compressionMethod: number;
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

    const rawData = bytes.slice(dataOffset, dataOffset + compressedSize);

    entries.push({
      name,
      compressedSize,
      uncompressedSize,
      offset: dataOffset,
      data: rawData,
      compressionMethod,
    });

    pos += 46 + nameLen + extraLen + commentLen;
  }

  return entries;
}

/**
 * Decompress a Deflate-compressed entry using DecompressionStream.
 */
async function decompressDeflateRaw(data: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream('deflate-raw');
  const writer = ds.writable.getWriter();
  writer.write(data);
  writer.close();
  const reader = ds.readable.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

/**
 * Get the decompressed data for an entry.
 */
export async function getEntryData(entry: ZipFileEntry): Promise<Uint8Array> {
  if (entry.compressionMethod === 0) {
    return entry.data;
  }
  if (entry.compressionMethod === 8) {
    if (typeof DecompressionStream === 'undefined') {
      throw new Error('DecompressionStream API is not available in this browser. Cannot decompress Deflate data.');
    }
    return decompressDeflateRaw(entry.data);
  }
  throw new Error(`Unsupported compression method: ${entry.compressionMethod}`);
}

/**
 * Download a single file entry.
 */
export async function downloadEntry(entry: ZipFileEntry): Promise<void> {
  const data = await getEntryData(entry);
  const blob = new Blob([data]);
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
export async function downloadAllEntries(entries: ZipFileEntry[]): Promise<void> {
  for (const entry of entries) {
    if (entry.data.length > 0 && !entry.name.endsWith('/')) {
      await downloadEntry(entry);
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
