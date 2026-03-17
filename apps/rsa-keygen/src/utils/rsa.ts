function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function formatPem(base64: string, type: 'PUBLIC' | 'PRIVATE'): string {
  const label = type === 'PUBLIC' ? 'PUBLIC KEY' : 'PRIVATE KEY';
  const lines: string[] = [`-----BEGIN ${label}-----`];
  for (let i = 0; i < base64.length; i += 64) {
    lines.push(base64.slice(i, i + 64));
  }
  lines.push(`-----END ${label}-----`);
  return lines.join('\n');
}

export type KeySize = 1024 | 2048 | 4096;

export interface RsaKeyPair {
  publicKey: string;
  privateKey: string;
}

export async function generateRsaKeyPair(keySize: KeySize): Promise<RsaKeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: keySize,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );

  const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  return {
    publicKey: formatPem(arrayBufferToBase64(publicKeyBuffer), 'PUBLIC'),
    privateKey: formatPem(arrayBufferToBase64(privateKeyBuffer), 'PRIVATE'),
  };
}
