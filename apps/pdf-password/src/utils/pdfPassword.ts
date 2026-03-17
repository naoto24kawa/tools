// Since pdf-lib doesn't support PDF encryption natively,
// we provide AES encryption wrapper for PDF files

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptPdf(file: File, password: string): Promise<Uint8Array> {
  const data = new Uint8Array(await file.arrayBuffer());
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

  // Format: MAGIC(8) + salt(16) + iv(12) + encrypted data
  const magic = new TextEncoder().encode('PDFCRYPT');
  const result = new Uint8Array(8 + 16 + 12 + encrypted.byteLength);
  result.set(magic, 0);
  result.set(salt, 8);
  result.set(iv, 24);
  result.set(new Uint8Array(encrypted), 36);
  return result;
}

export async function decryptPdf(file: File, password: string): Promise<Uint8Array> {
  const data = new Uint8Array(await file.arrayBuffer());
  const magic = new TextDecoder().decode(data.slice(0, 8));
  if (magic !== 'PDFCRYPT') {
    throw new Error('Not an encrypted PDF file');
  }

  const salt = data.slice(8, 24);
  const iv = data.slice(24, 36);
  const encrypted = data.slice(36);
  const key = await deriveKey(password, salt);

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);
  return new Uint8Array(decrypted);
}

export function downloadFile(data: Uint8Array, filename: string, type: string): void {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
