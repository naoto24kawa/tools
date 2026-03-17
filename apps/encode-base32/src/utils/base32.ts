const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function encodeBase32(input: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);
  let bits = '';
  for (const byte of bytes) {
    bits += byte.toString(2).padStart(8, '0');
  }
  while (bits.length % 5 !== 0) bits += '0';

  let result = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5);
    result += ALPHABET[Number.parseInt(chunk, 2)];
  }

  const padding = (8 - (result.length % 8)) % 8;
  return result + '='.repeat(padding);
}

export function decodeBase32(encoded: string): string {
  const cleaned = encoded.replace(/=+$/, '').toUpperCase();
  let bits = '';
  for (const char of cleaned) {
    const idx = ALPHABET.indexOf(char);
    if (idx === -1) throw new Error(`Invalid Base32 character: ${char}`);
    bits += idx.toString(2).padStart(5, '0');
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(Number.parseInt(bits.slice(i, i + 8), 2));
  }

  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(bytes));
}
