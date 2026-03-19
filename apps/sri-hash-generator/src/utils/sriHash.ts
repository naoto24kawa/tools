export type SriAlgorithm = 'sha256' | 'sha384' | 'sha512';

const ALGORITHM_MAP: Record<SriAlgorithm, string> = {
  sha256: 'SHA-256',
  sha384: 'SHA-384',
  sha512: 'SHA-512',
};

export async function generateSriHash(
  data: ArrayBuffer,
  algorithm: SriAlgorithm
): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(ALGORITHM_MAP[algorithm], data);
  const hashArray = new Uint8Array(hashBuffer);
  const base64 = btoa(String.fromCharCode(...hashArray));
  return `${algorithm}-${base64}`;
}

export async function generateSriHashFromText(
  text: string,
  algorithm: SriAlgorithm
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  return generateSriHash(data.buffer as ArrayBuffer, algorithm);
}

export function generateScriptTag(
  url: string,
  integrity: string,
  crossorigin = 'anonymous'
): string {
  return `<script src="${url}" integrity="${integrity}" crossorigin="${crossorigin}"></script>`;
}

export function generateLinkTag(
  url: string,
  integrity: string,
  crossorigin = 'anonymous'
): string {
  return `<link rel="stylesheet" href="${url}" integrity="${integrity}" crossorigin="${crossorigin}">`;
}

export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}
