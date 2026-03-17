const ALGORITHMS = [
  { value: 'SHA-256', label: 'HMAC-SHA256' },
  { value: 'SHA-384', label: 'HMAC-SHA384' },
  { value: 'SHA-512', label: 'HMAC-SHA512' },
  { value: 'SHA-1', label: 'HMAC-SHA1' },
] as const;

export { ALGORITHMS };

export type HmacAlgorithm = (typeof ALGORITHMS)[number]['value'];

export async function generateHMAC(
  message: string,
  secret: string,
  algorithm: HmacAlgorithm
): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, msgData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
