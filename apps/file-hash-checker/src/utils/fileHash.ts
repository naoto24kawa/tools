export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-512';

export interface HashResult {
  algorithm: string;
  hash: string;
}

/**
 * Calculate hash of a file using Web Crypto API (for SHA algorithms).
 */
export async function calculateHash(
  file: File,
  algorithm: HashAlgorithm,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const buffer = await readFileWithProgress(file, onProgress);
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  return arrayBufferToHex(hashBuffer);
}

/**
 * Calculate MD5 hash (simple implementation for browser use).
 */
export async function calculateMD5(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const buffer = await readFileWithProgress(file, onProgress);
  return md5(new Uint8Array(buffer));
}

/**
 * Calculate all hashes for a file.
 */
export async function calculateAllHashes(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<HashResult[]> {
  const buffer = await readFileWithProgress(file, onProgress);
  const uint8 = new Uint8Array(buffer);

  const [sha1, sha256, sha512] = await Promise.all([
    crypto.subtle.digest('SHA-1', uint8),
    crypto.subtle.digest('SHA-256', uint8),
    crypto.subtle.digest('SHA-512', uint8),
  ]);

  return [
    { algorithm: 'MD5', hash: md5(uint8) },
    { algorithm: 'SHA-1', hash: arrayBufferToHex(sha1) },
    { algorithm: 'SHA-256', hash: arrayBufferToHex(sha256) },
    { algorithm: 'SHA-512', hash: arrayBufferToHex(sha512) },
  ];
}

/**
 * Compare two hash strings (case-insensitive).
 */
export function compareHashes(hash1: string, hash2: string): boolean {
  return hash1.trim().toLowerCase() === hash2.trim().toLowerCase();
}

function readFileWithProgress(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress((e.loaded / e.total) * 100);
      }
    };
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Simple MD5 implementation
function md5(data: Uint8Array): string {
  function safeAdd(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function bitRotateLeft(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }

  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }

  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }

  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  // Convert to word array
  const len = data.length;
  const bitLen = len * 8;
  // Pad to 64-byte boundary
  const padded = new Uint8Array(((len + 72) & ~63));
  padded.set(data);
  padded[len] = 0x80;
  // Length in bits as 64-bit LE
  const dv = new DataView(padded.buffer);
  dv.setUint32(padded.length - 8, bitLen >>> 0, true);
  dv.setUint32(padded.length - 4, 0, true);

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let i = 0; i < padded.length; i += 64) {
    const w: number[] = [];
    for (let j = 0; j < 16; j++) {
      w[j] = dv.getUint32(i + j * 4, true);
    }

    let aa = a, bb = b, cc = c, dd = d;

    a = md5ff(a, b, c, d, w[0], 7, -680876936);
    d = md5ff(d, a, b, c, w[1], 12, -389564586);
    c = md5ff(c, d, a, b, w[2], 17, 606105819);
    b = md5ff(b, c, d, a, w[3], 22, -1044525330);
    a = md5ff(a, b, c, d, w[4], 7, -176418897);
    d = md5ff(d, a, b, c, w[5], 12, 1200080426);
    c = md5ff(c, d, a, b, w[6], 17, -1473231341);
    b = md5ff(b, c, d, a, w[7], 22, -45705983);
    a = md5ff(a, b, c, d, w[8], 7, 1770035416);
    d = md5ff(d, a, b, c, w[9], 12, -1958414417);
    c = md5ff(c, d, a, b, w[10], 17, -42063);
    b = md5ff(b, c, d, a, w[11], 22, -1990404162);
    a = md5ff(a, b, c, d, w[12], 7, 1804603682);
    d = md5ff(d, a, b, c, w[13], 12, -40341101);
    c = md5ff(c, d, a, b, w[14], 17, -1502002290);
    b = md5ff(b, c, d, a, w[15], 22, 1236535329);

    a = md5gg(a, b, c, d, w[1], 5, -165796510);
    d = md5gg(d, a, b, c, w[6], 9, -1069501632);
    c = md5gg(c, d, a, b, w[11], 14, 643717713);
    b = md5gg(b, c, d, a, w[0], 20, -373897302);
    a = md5gg(a, b, c, d, w[5], 5, -701558691);
    d = md5gg(d, a, b, c, w[10], 9, 38016083);
    c = md5gg(c, d, a, b, w[15], 14, -660478335);
    b = md5gg(b, c, d, a, w[4], 20, -405537848);
    a = md5gg(a, b, c, d, w[9], 5, 568446438);
    d = md5gg(d, a, b, c, w[14], 9, -1019803690);
    c = md5gg(c, d, a, b, w[3], 14, -187363961);
    b = md5gg(b, c, d, a, w[8], 20, 1163531501);
    a = md5gg(a, b, c, d, w[13], 5, -1444681467);
    d = md5gg(d, a, b, c, w[2], 9, -51403784);
    c = md5gg(c, d, a, b, w[7], 14, 1735328473);
    b = md5gg(b, c, d, a, w[12], 20, -1926607734);

    a = md5hh(a, b, c, d, w[5], 4, -378558);
    d = md5hh(d, a, b, c, w[8], 11, -2022574463);
    c = md5hh(c, d, a, b, w[11], 16, 1839030562);
    b = md5hh(b, c, d, a, w[14], 23, -35309556);
    a = md5hh(a, b, c, d, w[1], 4, -1530992060);
    d = md5hh(d, a, b, c, w[4], 11, 1272893353);
    c = md5hh(c, d, a, b, w[7], 16, -155497632);
    b = md5hh(b, c, d, a, w[10], 23, -1094730640);
    a = md5hh(a, b, c, d, w[13], 4, 681279174);
    d = md5hh(d, a, b, c, w[0], 11, -358537222);
    c = md5hh(c, d, a, b, w[3], 16, -722521979);
    b = md5hh(b, c, d, a, w[6], 23, 76029189);
    a = md5hh(a, b, c, d, w[9], 4, -640364487);
    d = md5hh(d, a, b, c, w[12], 11, -421815835);
    c = md5hh(c, d, a, b, w[15], 16, 530742520);
    b = md5hh(b, c, d, a, w[2], 23, -995338651);

    a = md5ii(a, b, c, d, w[0], 6, -198630844);
    d = md5ii(d, a, b, c, w[7], 10, 1126891415);
    c = md5ii(c, d, a, b, w[14], 15, -1416354905);
    b = md5ii(b, c, d, a, w[5], 21, -57434055);
    a = md5ii(a, b, c, d, w[12], 6, 1700485571);
    d = md5ii(d, a, b, c, w[3], 10, -1894986606);
    c = md5ii(c, d, a, b, w[10], 15, -1051523);
    b = md5ii(b, c, d, a, w[1], 21, -2054922799);
    a = md5ii(a, b, c, d, w[8], 6, 1873313359);
    d = md5ii(d, a, b, c, w[15], 10, -30611744);
    c = md5ii(c, d, a, b, w[6], 15, -1560198380);
    b = md5ii(b, c, d, a, w[13], 21, 1309151649);
    a = md5ii(a, b, c, d, w[4], 6, -145523070);
    d = md5ii(d, a, b, c, w[11], 10, -1120210379);
    c = md5ii(c, d, a, b, w[2], 15, 718787259);
    b = md5ii(b, c, d, a, w[9], 21, -343485551);

    a = safeAdd(a, aa);
    b = safeAdd(b, bb);
    c = safeAdd(c, cc);
    d = safeAdd(d, dd);
  }

  function toHex32(n: number): string {
    let s = '';
    for (let i = 0; i < 4; i++) {
      s += ((n >> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return s;
  }

  return toHex32(a) + toHex32(b) + toHex32(c) + toHex32(d);
}
