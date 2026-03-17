const HASH_ALGORITHM_OPTIONS = [
  { value: 'SHA-256', label: 'SHA-256' },
  { value: 'SHA-384', label: 'SHA-384' },
  { value: 'SHA-512', label: 'SHA-512' },
] as const;

export { HASH_ALGORITHM_OPTIONS };

export type HashAlgorithm = (typeof HASH_ALGORITHM_OPTIONS)[number]['value'];

export async function generateSHA(text: string, algorithm: HashAlgorithm): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
